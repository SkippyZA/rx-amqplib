'use strict';

const RxAmqpLib = require('../');

const config = {
  exchange: 'logs',
  exchangeType: 'fanout',
  host: 'amqp://localhost'
};

// Process stream
RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection
    .createChannel()
    .flatMap(channel => channel.assertExchange(config.exchange, config.exchangeType, {durable: false}))
    .doOnNext(exchange => exchange.channel.publish(config.exchange, '', new Buffer('test message')))
    .flatMap(exchange => exchange.channel.close())
    .flatMap(() => connection.close())
  )
  .subscribe(() => {}, console.error, () => console.log('Messages sent'));


