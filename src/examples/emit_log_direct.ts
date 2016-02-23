//#!/usr/bin/env node
//
//var amqp = require('amqplib');
//var when = require('when');
//
//var args = process.argv.slice(2);
//var severity = (args.length > 0) ? args[0] : 'info';
//var message = args.slice(1).join(' ') || 'Hello World!';
//
//amqp.connect('amqp://localhost').then(function(conn) {
//    return when(conn.createChannel().then(function(ch) {
//        var ex = 'direct_logs';
//        var ok = ch.assertExchange(ex, 'direct', {durable: false});
//
//        return ok.then(function() {
//            ch.publish(ex, severity, new Buffer(message));
//            console.log(" [x] Sent %s:'%s'", severity, message);
//            return ch.close();
//        });
//    })).ensure(function() { conn.close(); });
//}).then(null, console.warn);

import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import RxChannel from '../rx-amqplib/RxChannel';
import * as Rx from 'rx';
import * as R from 'ramda';

let config = {
  exchange: 'direct_logs',
  exchange_type: 'direct',
  host: 'amqp://localhost'
};

let args = process.argv.slice(2);
let severity = (args.length > 0) ? args[0] : 'info';
let message = args.slice(1).join(' ') || 'Hello World!';

let log = R.tap(console.log);
let publish = R.invoker(3, 'publish')(config.exchange);
let close = R.invoker(0, 'close');

console.log('[*] Emit logs direct');
RxAmqpLib.newConnection(config.host)
  .flatMap((connection: RxConnection) => connection
    .createChannel()
    .flatMap((channel: RxChannel) => channel
      .assertExchange(config.exchange, config.exchange_type, { durable: false })
      .flatMap(publish(severity, new Buffer(message)))
      .doOnNext(() => console.log('    Sent %s: \'%s\'', severity, message))
      .flatMap(close)
    )
    .flatMap(() => connection.close())
  )
  .subscribe(() => { }, console.error);