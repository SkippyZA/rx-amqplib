import {Message} from 'amqplib/properties';
import RxChannel from './RxChannel';

class RxMessage implements Message {
  content: Buffer;
  fields: any;
  properties: any;

  constructor(message: Message) {
    this.content = message.content;
    this.fields = message.fields;
    this.properties = message.properties;
  }

  ack(channel: RxChannel, allUpTo?: boolean): Rx.Observable<RxChannel> {
    return channel.ack(this, allUpTo);
  }
}

export default RxMessage;