import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import * as R from 'ramda';

let config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

// [PURE]
let assertQueue = R.invoker(2, 'assertQueue');
let sendToQueue = R.invoker(2, 'sendToQueue');

// Process stream
console.log('[*] Client connecting');
RxAmqpLib
  .newConnection(config.host)
  .createChannel()
  .doOnNext(() => console.log('[*] Connected!'))
  .flatMap(assertQueue(config.queue, { durable: false }))
  .flatMap(sendToQueue(config.queue, new Buffer('Test message')))
  .doOnNext(() => console.log('[*] Message sent'))
  .subscribe();