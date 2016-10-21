import { Replies } from 'amqplib/properties';
import RxChannel from '../RxChannel';
declare class EmptyReply implements Replies.Empty {
    channel: RxChannel;
    constructor(channel: RxChannel);
}
export default EmptyReply;
