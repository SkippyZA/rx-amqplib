import {Replies as AmqplibReply} from 'amqplib/properties';
import RxChannel from '../RxChannel';

/**
 * Message reply from `assertQueue`/`checkQueue` on a `RxChannel`
 */
class AssertQueueReply implements AmqplibReply.AssertQueue {
  public channel: RxChannel;
  public queue: string;
  public messageCount: number;
  public consumerCount: number;

  /**
   * Class constructor.
   *
   * @param channel
   * @param reply
   */
  constructor(channel: RxChannel, reply: AmqplibReply.AssertQueue) {
    this.channel = channel;

    this.queue = reply.queue;
    this.messageCount = reply.messageCount;
    this.consumerCount = reply.consumerCount;
  }
}

export default AssertQueueReply;