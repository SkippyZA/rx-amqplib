import {Replies as AmqplibReply} from 'amqplib/properties';
import RxChannel from '../RxChannel';

/**
 * AssertExchange reply message when executing `assertExchange` on a `RxChannel`
 */
class AssertExchangeReply implements AmqplibReply.AssertExchange {
  public channel: RxChannel;
  public exchange: string;

  /**
   * Class constructor.
   *
   * @param channel
   * @param reply
   */
  constructor(channel: RxChannel, reply: AmqplibReply.AssertExchange) {
    this.channel = channel;
    this.exchange = reply.exchange;
  }
}

export default AssertExchangeReply;