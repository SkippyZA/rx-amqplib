import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import {Message} from 'amqplib/properties';
import * as R from 'ramda';

let config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

// [PURE]
let messageContent = R.prop('content');
let toString = R.invoker(0, 'toString');
let logMessageContent = R.compose(console.log, toString, messageContent);

let consume = R.invoker(2, 'consume');
let consumeQueue = consume(config.queue, { noAck: true });

// Process stream
RxAmqpLib.newConnection(config.host)
  .createChannel()
  .flatMap(consumeQueue)
  .subscribe(logMessageContent);