'use strict';

const RxAmqpLib = require('../');
const fib = (n) => {
  let a = 0;
  let b = 1;

  for (let i = 0; i < n; i++) {
    let c = a + b;
    a = b;
    b = c;
  }

  return a;
};

let reply = (message) => {
  let number= parseInt(message.content.toString());
  let fibResponse = fib(number);

  console.log(' [.] fib(%d)', number);

  message.reply(new Buffer(fibResponse.toString()), {appId: 'RxAmqpLib'});
  message.ack();
};

const config = {
  host: 'amqp://localhost',
  queue: 'rpc_queue'
};

RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection.createChannel())
  .flatMap(channel => channel.assertQueue(config.queue, { durable: false }))
  .flatMap(queueReply => queueReply.channel.prefetch(1))
  .flatMap(emptyReply => emptyReply.channel.consume(config.queue))
  .subscribe(reply);
