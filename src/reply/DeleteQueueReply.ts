import {Replies} from 'amqplib/properties';
import RxChannel from '../RxChannel';

class DeleteQueueReply implements Replies.DeleteQueue {
  channel: RxChannel;
  messageCount: number;

  constructor(channel: RxChannel, deleteQueue: Replies.DeleteQueue) {
    this.channel = channel;
    this.messageCount = deleteQueue.messageCount;
  }
}

export default DeleteQueueReply;