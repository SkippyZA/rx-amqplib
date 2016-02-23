let severities = process.argv.slice(2);

if (severities.length < 1) {
  console.warn('Usage: receive_logs_direct.ts [info] [warning] [error]');
  process.exit(1);
}

import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import RxChannel from '../rx-amqplib/RxChannel';
import * as Rx from 'rx';
import * as R from 'ramda';


const config = {
  host: 'amqp://localhost',
  exchange: 'direct_logs',
  exchangeType: 'direct',
  queue: ''
};

//let bindToQueue = R.invoker(3, 'bindQueue')(config.queue, config.exchange);
//let consume = R.invoker(2, 'consume');
//let consumeQueue = consume(config.queue, { noAck: true });
//let messageContent = R.compose(R.toString, R.prop('content'));
//let assertQueue = R.invoker(2, 'assertQueue')(config.queue, { exclusive: true });
//// Impure: Display message content to console log
//let logMessageContent = R.compose(console.log, R.concat(' -> Received: '), messageContent);
//
//function logMessage(msg: any) { console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString()); };

let assertExchange = R.invoker(3, 'assertExchange')(config.exchange, config.exchangeType, { durable: false });
let assertQueue = R.invoker(2, 'assertQueue')('', { exclusive: true });
//let consumeQueue = R.invoker(3, 'consumeQueue')(ex)
//return ch.consume(queue, logMessage, { noAck: true });

console.log('[*] Worker running');
RxAmqpLib.newConnection(config.host)
  .flatMap((connection: RxConnection) => connection
    .createChannel()
    .tap(assertExchange)
    .flatMap(assertQueue)
    // Bind to a queue for each severity
    .flatMap((channel: RxChannel) => Rx.Observable
      .from(severities)
      .map(severity => channel.bindQueue(config.queue, config.exchange, severity))
      // Wait for them all to complete before we continue
      //.every(R.T)
      .map(() => channel)
    )
  )
  .subscribe(console.log, console.error);



  //.flatMap((connection: RxConnection) => connection
  //  .createChannel()
  //  .flatMap(assertQueue)
  //  .flatMap((channel: RxChannel) => Rx.Observable
  //    .from(severities)
  //    .map(severity => channel.bindQueue(config.queue, config.exchange, severity))
  //    // Wait for them all to complete before we continue
  //    //.every(R.T)
  //    .map(() => channel)
  //  )
  //  .flatMap(consumeQueue)
  //)
  //.subscribe(logMessage, console.error);
