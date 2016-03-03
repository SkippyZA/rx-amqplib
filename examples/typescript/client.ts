import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import RxChannel from '../rx-amqplib/RxChannel';
import AssertQueueReply from '../rx-amqplib/reply/AssertQueueReply';
import * as Rx from 'rx';

let config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

// Process stream
RxAmqpLib.newConnection(config.host)
  .flatMap((connection: RxConnection) => connection
    .createChannel()
    .flatMap(channel => channel.assertQueue(config.queue, { durable: false }))
    .doOnNext(queue => queue.channel.sendToQueue(config.queue, new Buffer('Test message')))
    .flatMap(queue => queue.channel.close())
    .flatMap(() => connection.close())
  )
  .subscribe();


