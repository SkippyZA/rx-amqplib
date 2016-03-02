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

  ack(allUpTo?: boolean): void {
    return this.channel.ack(this, allUpTo);
  }
}

export default RxMessage;