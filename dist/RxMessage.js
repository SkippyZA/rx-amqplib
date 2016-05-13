/**
 * RxMessage Class
 */
var RxMessage = (function () {
    /**
     * RxMessage constructor.
     *
     * @param message
     * @param channel
     */
    function RxMessage(message, channel) {
        this.content = message.content;
        this.fields = message.fields;
        this.properties = message.properties;
        this.channel = channel;
    }
    /**
     * Reply to a message. This is used for RPC calls where the message contains a replyTo and correlationId property..
     *
     * @param buffer
     * @returns boolean
     */
    RxMessage.prototype.reply = function (buffer, options) {
        if (!(this.properties.replyTo || this.properties.correlationId)) {
            // @TODO: Decide if whether to throw error or return false
            //throw Error('Message must contain a value for properties.replyTo and properties.correlationId');
            return false;
        }
        return this.channel.sendToQueue(this.properties.replyTo, buffer, Object.assign({}, options, {
            correlationId: this.properties.correlationId
        }));
    };
    /**
     * Acknowledge this message
     *
     * @param allUpTo
     */
    RxMessage.prototype.ack = function (allUpTo) {
        return this.channel.ack(this, allUpTo);
    };
    /**
     * Reject this message. If requeue is true, the message will be put back onto the queue it came from.
     *
     * @param requeue
     */
    RxMessage.prototype.nack = function (requeue) {
        return this.channel.nack(this, false, requeue);
    };
    return RxMessage;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxMessage;
