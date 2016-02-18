import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import * as Rx from 'rx';
import * as R from 'ramda';

const config = {
    host: 'amqp://localhost',
    queue: 'task_queue'
};

let close = R.invoker(0, 'close');
let createChannel = R.invoker(0, 'createChannel');
let assertQueue = R.invoker(2, 'assertQueue')(config.queue);
let sendToQueue = R.invoker(3, 'sendToQueue')(config.queue);

console.log('[*] New task');
RxAmqpLib.newConnection(config.host)
    .flatMap((connection: RxConnection) => {
        return createChannel(connection)
            .flatMap(assertQueue({ durable: true }))
            .flatMap(sendToQueue(new Buffer('Task'), { deliveryMode: true }))
            .flatMap(close)
            .flatMap(() => close(connection));
    })
    .subscribe()
;