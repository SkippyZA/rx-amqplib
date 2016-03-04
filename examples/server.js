'use strict';

const RxAmqpLib = require('../');

const config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

// Process stream
RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection.createChannel())
  .flatMap(channel => channel.assertQueue(config.queue, { durable: false }))
  .flatMap(reply => reply.channel.consume(config.queue, { noAck: true }))
  .subscribe(message => console.log(message.content.toString()));
