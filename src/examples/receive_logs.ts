import * as R from 'ramda';
import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxChannel from '../rx-amqplib/RxChannel';
import AssertExchangeReply from '../rx-amqplib/reply/AssertExchangeReply';
import AssertQueueReply from '../rx-amqplib/reply/AssertQueueReply';

let config = {
  exchange: 'logs',
  exchangeType: 'fanout',
  host: 'amqp://localhost'
};

let channel = R.prop('channel');
let messageContent = R.prop('content');
let createChannel = R.invoker(0, 'createChannel');
let assertExchange = R.invoker(3, 'assertExchange')(config.exchange, config.exchangeType, { durable: false });
// Having to do some serious type stuff here to make compiler happy. @TODO: Refactor
let assertQueue = <Rx.Observable<AssertQueueReply>> <any>
  R.compose(R.invoker(2, 'assertQueue')('', { exclusive: true }), channel);
// @TODO: Refactor this function
let consumeQueue = R.curry((queueName: string, options: any, queue: AssertQueueReply) =>
  queue.channel.consume(queueName, options));

// [IMPURE] Log message content from buffer to console.log
let logMessageContent = R.compose(console.log, R.toString, messageContent);


// Process stream
RxAmqpLib.newConnection(config.host)
  .flatMap(createChannel)
  .flatMap(assertExchange)
  .flatMap(assertQueue)
  .flatMap((queue: AssertQueueReply) =>
    queue.channel
      .bindQueue(queue.queue, config.exchange, '')
      .flatMap(consumeQueue(queue.queue, { noAck: true }))
  )
  .subscribe(logMessageContent, console.error);
