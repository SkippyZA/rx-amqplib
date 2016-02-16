import RxAmqpLib from '../src/rx-amqplib/RxAmqpLib';
import {Message} from 'amqplib/properties';
import * as R from 'ramda';

let config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

// [PURE]
let messageContent = R.prop('content');
let logMessageContent = R.compose(console.log, R.toString, messageContent);

let consume = R.invoker(2, 'consume');
let consumeQueue = consume(config.queue, { noAck: true });

// Process stream
console.log('[*] Consumer connecting');
RxAmqpLib.newConnection(config.host)
  .createChannel()
  .doOnNext(() => console.log('[*] Connected!'))
  .flatMap(consumeQueue)
  .subscribe(logMessageContent);