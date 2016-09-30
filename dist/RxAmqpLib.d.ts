/// <reference path="../typings/index.d.ts" />
import * as Rx from 'rx';
import RxConnection from './RxConnection';
/**
 * Factory for RxAmqpLib.
 */
declare class RxAmqpLib {
    /**
     * Create a new instance of RxConnection, which wraps the amqplib Connection obj.
     *
     * @param url URL to AMQP host. eg: amqp://localhost/
     * @param options Custom AMQP options
     * @returns {RxConnection}
     */
    static newConnection(url: string, options?: any): Rx.Observable<RxConnection>;
}
export default RxAmqpLib;
