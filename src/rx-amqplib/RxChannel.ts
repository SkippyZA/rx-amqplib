import * as Rx from 'rx';
import RxChannel from './RxChannel';
import {Connection, Channel, Options} from 'amqplib';

export default class RxChannel {

  constructor(private channel: Channel) {
  }

  public assertQueue(queue: string, options: any): Rx.Observable<RxChannel> {
    return Rx.Observable.fromPromise(this.channel.assertQueue(queue, options))
      .map(this);
  }

  public sendToQueue(queue: string, message: Buffer, options?: Options.Publish): Rx.Observable<RxChannel> {
    return Rx.Observable.just(this.channel.sendToQueue(queue, message, options))
      .map(this);
  };
}
