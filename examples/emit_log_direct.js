'use strict';

let RxAmqpLib = require('../');

let config = {
  exchange: 'direct_logs',
  exchangeType: 'direct',
  host: 'amqp://localhost'
};

let args = process.argv.slice(2);
let severity = (args.length > 0) ? args[0] : 'info';
let message = args.slice(1).join(' ') || 'Hello World!';


RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection
    .createChannel()
    .flatMap(channel => channel.assertExchange(config.exchange, config.exchangeType, { durable: false }))
    .doOnNext(reply => reply.channel.publish(config.exchange, severity, new Buffer(message)))
    .flatMap(reply => reply.channel.close())
    .flatMap(() => connection.close())
  )
  .subscribe(() => console.log('Sent %s: \'%s\'', severity, message), console.error);

