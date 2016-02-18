import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import {Message} from 'amqplib/properties';
import * as R from 'ramda';

let config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

let messageContent = R.prop('content');
let createChannel = R.invoker(0, 'createChannel');
let consume = R.invoker(2, 'consume');
let consumeQueue = consume(config.queue, { noAck: true });

let logMessageContent = R.compose(console.log, R.toString, messageContent);

// Process stream
console.log('[*] Consumer connecting');
RxAmqpLib.newConnection(config.host)
  .doOnNext(() => console.log('[*] Connected!'))
  .flatMap(createChannel)
  .flatMap(consumeQueue)
  .subscribe(logMessageContent);