import { Replies } from 'amqplib/properties';
import RxChannel from '../RxChannel';
declare class PurgeQueueReply implements Replies.PurgeQueue {
    channel: RxChannel;
    messageCount: number;
    constructor(channel: RxChannel, deleteQueue: Replies.PurgeQueue);
}
export default PurgeQueueReply;
