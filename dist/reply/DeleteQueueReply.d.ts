import { Replies } from 'amqplib/properties';
import RxChannel from '../RxChannel';
declare class DeleteQueueReply implements Replies.DeleteQueue {
    channel: RxChannel;
    messageCount: number;
    constructor(channel: RxChannel, deleteQueue: Replies.DeleteQueue);
}
export default DeleteQueueReply;
