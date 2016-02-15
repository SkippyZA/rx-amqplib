import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import * as R from 'ramda';

let config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

// [PURE]
let assertQueue = R.invoker(2, 'assertQueue');
let sendToQueue = R.invoker(2, 'sendToQueue');
let closeChannel = <any> R.invoker(0, 'close');

// Process stream
console.log('[*] Client connecting');
let conn = RxAmqpLib.newConnection(config.host);
conn.createChannel()
  .doOnNext(() => console.log('[*] Connected!'))
  .flatMap(assertQueue(config.queue, { durable: false }))
  .flatMap(sendToQueue(config.queue, new Buffer('Test message')))
  .doOnNext(() => console.log('[*] Message sent'))
  .flatMap(closeChannel)
  .flatMap(() => conn.close())
  .subscribe();