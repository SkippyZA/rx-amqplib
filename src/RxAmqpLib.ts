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
      .flatMap<RxConnection>((conn: Connection): any => {
        // Disposable observable to close connection
        const connectionDisposer = Rx.Disposable.create(() => conn.close().catch(err => Rx.Observable.throw(err)));
        // New RxConnection stream
        const sourceConnection = Rx.Observable.of(new RxConnection(conn));
        // Stream of close events from connection
        const closeEvents = Rx.Observable.fromEvent(conn, 'close');
        // Stream of Errors from error connection event
        const errorEvents = Rx.Observable.fromEvent(conn, 'error')
          .flatMap((error: any) => Rx.Observable.throw(error));
        // Stream of open connections, that will emit RxConnection until a close event
        const connection = Rx.Observable
          .merge(sourceConnection, errorEvents)
          .takeUntil(closeEvents);

        // Return the disposable connection resource
        return Rx.Observable.using(
          () => connectionDisposer,
          () => connection
        )
      });
  }
}

export default RxAmqpLib;
