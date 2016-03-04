'use strict';

const RxAmqpLib = require('../');
const config = {
  exchange: 'logs',
  exchangeType: 'fanout',
  host: 'amqp://localhost'
};

// Process stream
RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection.createChannel())
  .flatMap(channel => channel.assertExchange(config.exchange, config.exchangeType, { durable: false }))
  .flatMap(exchange => exchange.channel.assertQueue('', { exclusive: true }))
  .flatMap(queue => queue.channel
    .bindQueue(queue.queue, config.exchange, '')
    .flatMap(queue.channel.consume(queue.queue, { noAck: true }))
  )
  .subscribe(message => console.log(message.content.toString()), console.error);
