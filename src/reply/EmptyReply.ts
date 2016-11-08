import {Replies as AmqplibReply} from 'amqplib/properties';
import RxChannel from '../RxChannel';

/**
 * Emptry reply message containing `RxChannel`.
 */
class EmptyReply implements AmqplibReply.Empty {
  channel: RxChannel;

  /**
   * Class constructor.
   *
   * @param channel
   */
  constructor(channel: RxChannel) {
    this.channel = channel;
  }
}

export default EmptyReply;