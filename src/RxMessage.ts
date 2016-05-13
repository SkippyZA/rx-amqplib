import {Message} from 'amqplib/properties';
import {Options} from 'amqplib';
import RxChannel from './RxChannel';

/**
 * RxMessage Class
 */
class RxMessage implements Message {
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
  constructor(message: Message, channel?: RxChannel) {
    this.content = message.content;
    this.fields = message.fields;
    this.properties = message.properties;
    this.channel = channel;
  }

  /**
   * Reply to a message. This is used for RPC calls where the message contains a replyTo and correlationId property..
   *
   * @param buffer
   * @returns boolean
   */
  reply(buffer: Buffer, options?: Options.Publish): boolean {
    if (!(this.properties.replyTo || this.properties.correlationId)) {
      // @TODO: Decide if whether to throw error or return false
      //throw Error('Message must contain a value for properties.replyTo and properties.correlationId');
      return false;
    }

    return this.channel.sendToQueue(this.properties.replyTo, buffer, (<any>Object).assign({}, options, {
      correlationId: this.properties.correlationId
    }));
  }

  /**
   * Acknowledge this message
   *
   * @param allUpTo
   */
  ack(allUpTo?: boolean): void {
    return this.channel.ack(this, allUpTo);
  }

  /**
   * Reject this message. If requeue is true, the message will be put back onto the queue it came from.
   *
   * @param requeue
   */
  nack(requeue?: boolean): void {
    return this.channel.nack(this, false, requeue);
  }
}

export default RxMessage;
