"use strict";
var AssertQueueReply = (function () {
    function AssertQueueReply(channel, reply) {
        this.channel = channel;
        this.queue = reply.queue;
        this.messageCount = reply.messageCount;
        this.consumerCount = reply.consumerCount;
    }
    return AssertQueueReply;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AssertQueueReply;
