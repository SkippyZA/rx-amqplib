import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import RxChannel from '../rx-amqplib/RxChannel';
import * as Rx from 'rx';
import * as R from 'ramda';
import RxMessage from "../rx-amqplib/RxMessage";

let fib = (n: number) => {
  let a = 0;
  let b = 1;

  for (let i = 0; i < n; i++) {
    let c = a + b;
    a = b;
    b = c;
  }

  return a;
};

const config = {
  host: 'amqp://localhost',
  queue: 'rpc_queue'
};

let reply = (message: RxMessage) => {
  let number: number = parseInt(message.content.toString());
  let fibResponse = fib(number);

  console.log(' [.] fib(%d)', number);

  message.reply(new Buffer(fibResponse.toString()));
  message.ack();
};

RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection.createChannel())
  .flatMap(channel => channel.assertQueue(config.queue, { durable: false }))
  .flatMap(queueReply => queueReply.channel.prefetch(1))
  .flatMap(emptyReply => emptyReply.channel.consume(config.queue))
  .subscribe(reply);