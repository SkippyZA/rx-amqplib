'use strict';

let R = require('ramda');
let amqp = require('./rx-amqplib');

let assertQueue = R.invoker(2, 'assertQueue');
let sendToQueue = R.invoker(2, 'sendToQueue');


let queue = amqp.connect('amqp://192.168.99.100')
  .createChannel()
  .flatMap(assertQueue('hello', { durable: false }))
  .doOnNext(console.log)
  //.flatMap(sendToQueue('hello', new Buffer('from rx')))
  .subscribe(
    console.log,
    console.error
  );

console.log(queue);

  //.createChannel()
  //.subscribe(console.log);
