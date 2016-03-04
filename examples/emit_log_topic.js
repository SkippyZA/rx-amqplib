'use strict';

const RxAmqpLib = require('../');

const config = {
  exchange: 'topic_logs',
  exchangeType: 'topic',
  host: 'amqp://localhost'
};

RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection
    .createChannel()
    .flatMap(channel => channel.assertExchange(config.exchange, config.exchangeType, { durable: false }))
    .doOnNext(reply => reply.channel.publish(config.exchange, severity, new Buffer(message)))
    .doOnNext(() => console.log('[x] Sent %s: \'%s\'', severity, message))
    .flatMap(reply => reply.channel.close())
    .flatMap(() => connection.close())
  )
  .subscribe(() => {}, console.error);

