import { Replies } from 'amqplib/properties';
import RxChannel from '../RxChannel';
declare class AssertExchangeReply implements Replies.AssertExchange {
    channel: RxChannel;
    exchange: string;
    constructor(channel: RxChannel, reply: Replies.AssertExchange);
}
export default AssertExchangeReply;
