import {Replies as AmqplibReply} from 'amqplib/properties';
import RxChannel from '../RxChannel';

/**
 * Reply message from `RxChannel`.`deleteQueue`
 */
class DeleteQueueReply implements AmqplibReply.DeleteQueue {
  channel: RxChannel;
  messageCount: number;

  /**
   * Class constructor.
   *
   * @param channel
   * @param deleteQueue
   */
  constructor(channel: RxChannel, deleteQueue: AmqplibReply.DeleteQueue) {
    this.channel = channel;
    this.messageCount = deleteQueue.messageCount;
  }
}

export default DeleteQueueReply;