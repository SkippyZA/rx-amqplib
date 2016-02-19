import RxAmqpLib from '../rx-amqplib/RxAmqpLib';
import RxConnection from '../rx-amqplib/RxConnection';
import RxChannel from '../rx-amqplib/RxChannel';
import * as Rx from 'rx';
import * as R from 'ramda';

let config = {
  exchange: 'logs',
  exchange_type: 'fanout',
  host: 'amqp://localhost'
};

let log = (x: any) => { console.log(x); return x; };
let publish = R.invoker(3, 'publish')(config.exchange, '');
let close = R.invoker(0, 'close');

console.log('[*] Emit logs');
RxAmqpLib.newConnection(config.host)
  .flatMap((connection: RxConnection) => connection
    .createChannel()
    .flatMap((channel: RxChannel) => channel
      .assertExchange(config.exchange, config.exchange_type, { durable: false })
      .flatMap(publish(new Buffer('Herpa durp')))
      .doOnNext(() => console.log('    Sent'))
      .flatMap(close)
    )
    .flatMap(() => connection.close())
  )
  .subscribe(() => {}, console.error);