//var amqp = require('amqplib');
//var when = require('when');
//
//amqp.connect('amqp://localhost').then(function(conn) {
//    return when(conn.createChannel().then(function(ch) {
//        var q = 'task_queue';
//        var ok = ch.assertQueue(q, {durable: true});
//
//        return ok.then(function() {
//            var msg = process.argv.slice(2).join(' ') || "Hello World!";
//            ch.sendToQueue(q, new Buffer(msg), {deliveryMode: true});
//            console.log(" [x] Sent '%s'", msg);
//            return ch.close();
//        });
//    })).ensure(function() { conn.close(); });
//}).then(null, console.warn);


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