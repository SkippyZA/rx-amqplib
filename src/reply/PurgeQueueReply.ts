import {Replies as AmqplibReply} from 'amqplib/properties';
import RxChannel from '../RxChannel';

/**
 * `purgeQueue` reply from `RxChannel.
 */
class PurgeQueueReply implements AmqplibReply.PurgeQueue {
  channel: RxChannel;
  messageCount: number;

  /**
   * Class constructor.
   *
   * @param channel
   * @param deleteQueue
   */
  constructor(channel: RxChannel, deleteQueue: AmqplibReply.PurgeQueue) {
    this.channel = channel;
    this.messageCount = deleteQueue.messageCount;
  }
}

export default PurgeQueueReply;