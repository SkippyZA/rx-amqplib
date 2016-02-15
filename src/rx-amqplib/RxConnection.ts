import * as Rx from 'rx';
import RxChannel from './RxChannel';
import {Connection, Channel, Options} from 'amqplib';

/**
 * Connection to AMQP server.
 */
export default class RxConnection {
  /**
   * Class constructor
   *
   * @param connection
   */
  constructor(private connection: Rx.Observable<Connection>) {
  }

  /**
   * Opens a channel. May fail if there are no more channels available.
   *
   * @returns {any}
   */
  public createChannel(): Rx.Observable<RxChannel> {
    return this.connection
      .flatMap((conn: Connection) => conn.createChannel())
      .map((channel: Channel) => new RxChannel(channel));
  }
}
