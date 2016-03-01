import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import {Message} from 'amqplib/properties';
import * as R from 'ramda';

let config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

let messageContent = R.prop('content');
let logMessageContent = R.compose(console.log, R.toString, messageContent);

// Process stream
RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection.createChannel())
  .flatMap(channel => channel.consume(config.queue, { noAck: true }))
  .subscribe(logMessageContent);

