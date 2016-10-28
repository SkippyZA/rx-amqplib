'use strict';

const RxAmqpLib = require('../');

const args = process.argv.slice(2);
const severity = (args.length > 0) ? args[0] : 'info';
const message = args.slice(1).join(' ') || 'Hello World!';
const config = {
  exchange: 'direct_logs',
  exchangeType: 'direct',
  host: 'amqp://localhost'
};

RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection
    .createChannel()
    .flatMap(channel => channel.assertExchange(config.exchange, config.exchangeType, { durable: false }))
    .do(reply => reply.channel.publish(config.exchange, severity, new Buffer(message)))
    .flatMap(reply => reply.channel.close())
    .flatMap(() => connection.close())
  )
  .subscribe(() => console.log('Sent %s: \'%s\'', severity, message), console.error);
