import {RxAmqpLib} from './rx-amqplib/RxAmqpLib';
import RxChannel from './rx-amqplib/RxChannel';
import * as R from 'ramda';

let config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

let assertQueue = R.invoker(2, 'assertQueue');
let sendToQueue = R.invoker(2, 'sendToQueue');

RxAmqpLib
  .newConnection(config.host)
  .createChannel()
  .flatMap(assertQueue(config.queue, { durable: false }))
  .flatMap(sendToQueue(config.queue, new Buffer('Test message')))
  .subscribe();