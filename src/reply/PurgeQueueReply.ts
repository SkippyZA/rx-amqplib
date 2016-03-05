import {Replies} from 'amqplib/properties';
import RxChannel from '../RxChannel';

class PurgeQueueReply implements Replies.PurgeQueue {
  channel: RxChannel;
  messageCount: number;

  constructor(channel: RxChannel, deleteQueue: Replies.PurgeQueue) {
    this.channel = channel;
    this.messageCount = deleteQueue.messageCount;
  }
}

export default PurgeQueueReply;