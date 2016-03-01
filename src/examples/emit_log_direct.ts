import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import RxChannel from '../rx-amqplib/RxChannel';
import * as Rx from 'rx';
import * as R from 'ramda';
import AssertExchangeReply from "../rx-amqplib/reply/AssertExchangeReply";

let config = {
  exchange: 'direct_logs',
  exchange_type: 'direct',
  host: 'amqp://localhost'
};

let args = process.argv.slice(2);
let severity = (args.length > 0) ? args[0] : 'info';
let message = args.slice(1).join(' ') || 'Hello World!';

let close = R.invoker(0, 'close');

RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection
    .createChannel()
    .flatMap((channel: RxChannel) => channel.assertExchange(config.exchange, config.exchange_type, { durable: false }))
    .doOnNext((reply: AssertExchangeReply) => reply.channel.publish(config.exchange, severity, new Buffer(message)))
    .doOnNext(() => console.log('Sent %s: \'%s\'', severity, message))
    .flatMap((reply: AssertExchangeReply) => close(reply.channel))
    .flatMap(() => close(connection))
  )
  .subscribe(() => {}, console.error);

