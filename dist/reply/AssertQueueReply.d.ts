import { Replies } from 'amqplib/properties';
import RxChannel from '../RxChannel';
declare class AssertQueueReply implements Replies.AssertQueue {
    channel: RxChannel;
    queue: string;
    messageCount: number;
    consumerCount: number;
    constructor(channel: RxChannel, reply: Replies.AssertQueue);
}
export default AssertQueueReply;
