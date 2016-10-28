import { Observable, Subscription } from 'rxjs';
import * as AmqpLib from 'amqplib';
import RxConnection from './RxConnection';
import { Connection } from 'amqplib';

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
  public static newConnection(url: string, options?: any): Observable<RxConnection> {

    // Doing it like this to make it a cold observable. When starting with the promise directly, the node application
    // stays open as AmqpLib connects straight away, and not when you subscribe to the stream.
    return Observable
      .defer(() => AmqpLib.connect(url, options))
      .flatMap((conn: Connection): any => {
        // Disposable observable to close connection
        const connectionDisposer = new Subscription(() => conn.close().catch(err => Observable.throw(err)));
        // New RxConnection stream
        const sourceConnection = Observable.of(new RxConnection(conn));
        // Stream of close events from connection
        const closeEvents = Observable.fromEvent(conn, 'close');
        // Stream of Errors from error connection event
        const errorEvents = Observable.fromEvent(conn, 'error')
          .flatMap((error: any) => Observable.throw(error));
        // Stream of open connections, that will emit RxConnection until a close event
        const connection = Observable
          .merge(sourceConnection, errorEvents)
          .takeUntil(closeEvents);

        // Return the disposable connection resource
        return Observable.using(
          () => connectionDisposer,
          () => connection
        );
      });
  }
}

export default RxAmqpLib;
