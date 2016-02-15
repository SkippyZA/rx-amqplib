import * as Rx from 'rx';
import RxChannel from './RxChannel';
import {Connection, Channel, Options} from 'amqplib';

export default class RxConnection {
  constructor(private connection: Rx.Observable<Connection>) {
  }

  public createChannel(): Rx.Observable<RxChannel> {
    return this.connection
      .flatMap((conn: Connection) => conn.createChannel())
      .map((channel: Channel) => new RxChannel(channel));
  }
}
