import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import * as R from 'ramda';

let config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

// [PURE]
let assertQueue = R.invoker(2, 'assertQueue')(config.queue);
let sendToQueue = R.invoker(2, 'sendToQueue')(config.queue);
let close = R.invoker(0, 'close');

// Process stream
console.log('[*] Client connecting');
// @TODO: This is so broken. It needs to return an observable
let conn = RxAmqpLib.newConnection(config.host);

conn.createChannel()
  .flatMap(assertQueue({ durable: false }))
  .flatMap(sendToQueue(new Buffer('Test message')))
  .doOnNext(() => console.log('[*] Message sent'))
  .flatMap(close(conn))
  .subscribe();