import * as Rx from 'rx';
import * as AmqpLib from 'amqplib';
import RxConnection from './RxConnection';
import {Connection} from 'amqplib';

/**
 * Factory for RxAmqpLib.
 */
class RxAmqpLib {

  /**
   * Create a new instance of RxConnection, which wraps the amqplib Connection obj.
   *
   * @param url URL to AMQP host. eg: amqp://localhost/
   * @param options Custom AMQP options
   * @returns {RxConnection}
   */
  public static newConnection(url: string, options?: any): Rx.Observable<RxConnection> {
    // Doing it like this to make it a cold observable. When starting with the promise directly, the node application
    // stays open as AmqpLib connects straight away, and not when you subscribe to the stream.
    return Rx.Observable
      .defer(() => AmqpLib.connect(url, options))
      .flatMap<RxConnection>((conn: Connection) =>
        Rx.Observable.using(() => Rx.Disposable.create(() => conn.close()), resource =>
          Rx.Observable.merge(
            Rx.Observable.of(new RxConnection(conn)),
            Rx.Observable.fromEvent(conn, 'error').flatMap((e: any) => Rx.Observable.throw(e))
          )
          .takeUntil(Rx.Observable.fromEvent(conn, 'close'))
        )
      );
  }
}

export default RxAmqpLib;
