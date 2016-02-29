import {Replies} from 'amqplib/properties';
import RxChannel from '../RxChannel';

class AssertExchangeReply implements Replies.AssertExchange {
  public channel: RxChannel;
  public exchange: string;

  constructor(channel: RxChannel, reply: Replies.AssertExchange) {
    this.channel = channel;
    this.exchange = reply.exchange;
  }
}

export default AssertExchangeReply;