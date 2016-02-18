import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
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
    .flatMap((channel: RxChannel) => channel.assertQueue(config.queue, { durable: true })
      .flatMap(prefetchOne)
      .flatMap(consumeQueue)
      .doOnNext((message: Message) => console.log(' -> Received: \'%s\'', messageContent(message)))
      .delay(1000)
      .doOnNext(() => console.log('    Done\n'))
      .flatMap(message => channel.ack(message))
    )
  )
  .subscribe();
