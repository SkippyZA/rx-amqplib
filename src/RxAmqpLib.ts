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
    return Rx.Observable.create((obs: Rx.Observer<RxConnection>) => {
      var openConn: Connection;

      var sub = Rx.Observable.fromPromise(AmqpLib.connect(url, options))
        .subscribe((conn: Connection) => {
          openConn = conn;

          conn.on('error', (e: any) => {
            openConn = undefined;
            obs.onError(e);
          });

          conn.on('close', () => {
            openConn = undefined;
            obs.onCompleted();
          });

          obs.onNext(new RxConnection(conn));
        }, e => obs.onError(e));

      return () => {
        sub.dispose();
        openConn && openConn.close();
      }
    });
  }
}

export default RxAmqpLib;
