import { Message } from 'amqplib/properties';
import { Options } from 'amqplib';
import RxChannel from './RxChannel';
/**
 * RxMessage Class
 */
declare class RxMessage implements Message {
    content: Buffer;
    fields: any;
    properties: any;
    channel: RxChannel;
    /**
     * RxMessage constructor.
     *
     * @param message
     * @param channel
     */
    constructor(message: Message, channel?: RxChannel);
    /**
     * Reply to a message. This is used for RPC calls where the message contains a replyTo and correlationId property..
     *
     * @param buffer
     * @returns boolean
     */
    reply(buffer: Buffer, options?: Options.Publish): boolean;
    /**
     * Acknowledge this message
     *
     * @param allUpTo
     */
    ack(allUpTo?: boolean): void;
    /**
     * Reject this message. If requeue is true, the message will be put back onto the queue it came from.
     *
     * @param requeue
     */
    nack(requeue?: boolean): void;
}
export default RxMessage;
