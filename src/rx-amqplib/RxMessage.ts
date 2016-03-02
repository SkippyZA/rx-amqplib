import {Message} from 'amqplib/properties';
import RxChannel from './RxChannel';

class RxMessage implements Message {
  content: Buffer;
  fields: any;
  properties: any;
  channel: RxChannel;

  constructor(message: Message, channel?: RxChannel) {
    this.content = message.content;
    this.fields = message.fields;
    this.properties = message.properties;
    this.channel = channel;
  }

  reply(buffer: Buffer): boolean {
    if (!(this.properties.replyTo || this.properties.correlationId)) {
      // @TODO: Decide if whether to throw error or return false
      //throw Error('Message must contain a value for properties.replyTo and properties.correlationId');
      return false;
    }

    return this.channel.sendToQueue(this.properties.replyTo, buffer, {
      correlationId: this.properties.correlationId
    });
  }

  ack(allUpTo?: boolean): void {
    return this.channel.ack(this, allUpTo);
  }
}

export default RxMessage;