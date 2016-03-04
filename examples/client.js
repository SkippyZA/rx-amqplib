'use strict';

const RxAmqpLib = require('../index.js');

const config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

// Process stream
RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection
    .createChannel()
    .flatMap(channel => channel.assertQueue(config.queue, { durable: false }))
    .doOnNext(reply => reply.channel.sendToQueue(config.queue, new Buffer('Test message')))
    .flatMap(reply => reply.channel.close())
    .flatMap(() => connection.close())
  )
  .subscribe(() => console.log('Message sent'));
