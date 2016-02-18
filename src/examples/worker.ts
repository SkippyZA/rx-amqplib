import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import RxChannel from '../rx-amqplib/RxChannel';
import * as Rx from 'rx';
import * as R from 'ramda';

const config = {
  host: 'amqp://localhost',
  queue: 'task_queue'
};

let prefetchOne = R.invoker(1, 'prefetch')(1);
let consume = R.invoker(2, 'consume');
let consumeQueue = consume(config.queue, { noAck: false });
let messageContent = R.compose(R.toString, R.prop('content'));
let ack = R.invoker(1, 'ack');
// Impure: Display message content to console log
let logMessageContent = R.compose(console.log, R.concat(' -> Received: '), messageContent);

console.log('[*] Worker running');
RxAmqpLib.newConnection(config.host)
  .flatMap((connection: RxConnection) => connection
    .createChannel()
    .flatMap((channel: RxChannel) => channel
      .assertQueue(config.queue, { durable: true })
      .flatMap(prefetchOne)
      .flatMap(consumeQueue)
      .doOnNext(logMessageContent)
      .delay(2000)
      .flatMap(ack(channel))
    )
  )
  .subscribe(() => console.log('    Done\n'), console.error);
