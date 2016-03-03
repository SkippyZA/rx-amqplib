import {Replies} from 'amqplib/properties';
import RxChannel from "../RxChannel";


class AssertQueueReply implements Replies.AssertQueue {
  public channel: RxChannel;
  public queue: string;
  public messageCount: number;
  public consumerCount: number;

  constructor(channel: RxChannel, reply: Replies.AssertQueue) {
    this.channel = channel;

    this.queue = reply.queue;
    this.messageCount = reply.messageCount;
    this.consumerCount = reply.consumerCount;
  }
}

export default AssertQueueReply;