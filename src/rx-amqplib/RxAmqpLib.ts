import * as Rx from 'rx';
import * as AmqpLib from 'amqplib';
import RxConnection from './RxConnection';
import {Connection} from 'amqplib';

/**
 * Factory for RxAmqpLib.
 */
export default class RxAmqpLib {

  /**
   * Create a new instance of RxConnection, which wraps the amqplib Connection obj.
   *
   * @param url URL to AMQP host. eg: amqp://localhost/
   * @param options Custom AMQP options
   * @returns {RxConnection}
   */
  public static newConnection(url: string, options?: any): RxConnection {
    let amqpObservable: Rx.Observable<Connection> = Rx.Observable.fromPromise(AmqpLib.connect(url, options));
    return new RxConnection(amqpObservable);
  }
}