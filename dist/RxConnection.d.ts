import * as Rx from 'rx';
import RxChannel from './RxChannel';
import { Connection } from 'amqplib';
/**
 * Connection to AMQP server.
 */
declare class RxConnection {
    private connection;
    /**
     * Class constructor
     *
     * @param connection
     */
    constructor(connection: Connection);
    /**
     * Opens a channel. May fail if there are no more channels available.
     *
     * @returns {any}
     */
    createChannel(): Rx.Observable<RxChannel>;
    /**
     * Close the connection cleanly. Will immediately invalidate any unresolved operations, so it's best to make sure
     * you've done everything you need to before calling this. Will be resolved once the connection, and underlying
     * socket, are closed.
     *
     * @returns Rx.Observable<void>
     */
    close(): Rx.Observable<void>;
}
export default RxConnection;
