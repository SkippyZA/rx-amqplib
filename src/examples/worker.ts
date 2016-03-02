import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import RxChannel from '../rx-amqplib/RxChannel';
import * as Rx from 'rx';
import * as R from 'ramda';

const config = {
  host: 'amqp://localhost',
  queue: 'task_queue'
};

let messageContent = R.compose(R.toString, R.prop('content'));
// Impure: Display message content to console log
let logMessageContent = R.compose(console.log, R.concat('[x] Received: '), messageContent);

RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection.createChannel())
  .flatMap(channel => channel.assertQueue(config.queue, { durable: true }))
  .flatMap(reply => reply.channel.prefetch(1))
  .flatMap(reply => reply.channel.consume(config.queue, { noAck: false }))
  .doOnNext(logMessageContent)
  .delay(2000)
  .doOnNext(reply => reply.ack())
  .subscribe(() => console.log('[ ] Done\n'), console.error);


