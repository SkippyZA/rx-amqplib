'use strict';

const RxAmqpLib = require('../');
const UUID = require('uuid');
const config = {
  host: 'amqp://localhost',
  queue: 'rpc_queue'
};

RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection
    .createChannel()
    .flatMap(channel => channel
      .assertQueue('', { exclusive: true })
      .doOnNext(queueReply => channel
        .sendToQueue(config.queue, new Buffer('12'), {
          correlationId: UUID.v1(),
          replyTo: queueReply.queue
        }))
      .flatMap(queueReply => queueReply.channel.consume(queueReply.queue, { noAck: true }))
      .doOnNext(msg => console.log('fib(12) = %s', msg.content.toString()))
      .flatMap(() => channel.close())
    )
    .flatMap(() => connection.close())
  )
  .subscribe(() => {}, console.error);
