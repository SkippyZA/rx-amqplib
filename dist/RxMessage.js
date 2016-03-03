var RxMessage = (function () {
    function RxMessage(message, channel) {
        this.content = message.content;
        this.fields = message.fields;
        this.properties = message.properties;
        this.channel = channel;
    }
    RxMessage.prototype.reply = function (buffer) {
        if (!(this.properties.replyTo || this.properties.correlationId)) {
            // @TODO: Decide if whether to throw error or return false
            //throw Error('Message must contain a value for properties.replyTo and properties.correlationId');
            return false;
        }
        return this.channel.sendToQueue(this.properties.replyTo, buffer, {
            correlationId: this.properties.correlationId
        });
    };
    RxMessage.prototype.ack = function (allUpTo) {
        return this.channel.ack(this, allUpTo);
    };
    return RxMessage;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxMessage;
