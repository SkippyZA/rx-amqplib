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
RxAmqpLib
  .newConnection(config.host)
  .createChannel()
  .flatMap(assertQueue(config.queue, { durable: false }))
  .flatMap(sendToQueue(config.queue, new Buffer('Test message')))
  .subscribe();