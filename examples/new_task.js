'use strict';

const RxAmqpLib = require('..');

const config = {
  host: 'amqp://localhost',
  queue: 'task_queue'
};

RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection
    .createChannel()
    .flatMap(channel => channel.assertQueue(config.queue, { durable: true }))
    .doOnNext(assertQueueReply => {
      assertQueueReply.channel.sendToQueue(config.queue, new Buffer('Task'), { deliveryMode: true });
      console.log('[x] Task sent to queue');
    })
    .flatMap(assertQueueReply => assertQueueReply.channel.close())
    .flatMap(() => connection.close())
  )
  .subscribe();

