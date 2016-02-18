import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import * as Rx from 'rx';
import * as R from 'ramda';

let config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

let assertQueue = R.invoker(2, 'assertQueue')(config.queue);
let sendToQueue = R.invoker(2, 'sendToQueue')(config.queue);
let createChannel = R.invoker(0, 'createChannel');
let close = R.invoker(0, 'close');

// Process stream
console.log('[*] Client connecting');
RxAmqpLib.newConnection(config.host)
  .flatMap((connection: RxConnection) =>
    createChannel(connection)
      .flatMap(assertQueue({ durable: false }))
      .flatMap(sendToQueue(new Buffer('Test message')))
      .doOnNext(() => console.log('[*] Message sent'))
      .flatMap(close)
      .flatMap(() => close(connection))
  )
  .subscribe();


