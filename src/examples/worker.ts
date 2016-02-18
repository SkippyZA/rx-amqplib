import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import RxChannel from '../rx-amqplib/RxChannel';
import {Message} from 'amqplib/properties';
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


console.log('[*] Worker running');
RxAmqpLib.newConnection(config.host)
  .flatMap((connection: RxConnection) => connection.createChannel()
    .flatMap((channel: RxChannel) => channel
      .assertQueue(config.queue, { durable: true })
      .flatMap(prefetchOne)
      .flatMap(consumeQueue)
      .doOnNext(message => console.log(' -> Received: \'%s\'', messageContent(message)))
      .delay(2000)
      .doOnNext(() => console.log('    Done\n'))
      // @TODO: This needs to be refactored. Perhaps it will be best to make my own RxMessage class which has ack and
      // takes a method
      .flatMap((message?: Message) => channel.ack(message))
    )
  )
  .subscribe();
