'use strict';

const RxAmqpLib = require('../');

const config = {
  host: 'amqp://localhost',
  queue: 'task_queue'
};

RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection.createChannel())
  .flatMap(channel => channel.assertQueue(config.queue, { durable: true }))
  .flatMap(reply => reply.channel.prefetch(1))
  .flatMap(reply => reply.channel.consume(config.queue, { noAck: false }))
  .doOnNext(message => console.log('[x] Received: %s', message.content.toString()))
  .delay(2000)
  .doOnNext(reply => reply.ack())
  .subscribe(() => console.log('[ ] Done\n'), console.error);


