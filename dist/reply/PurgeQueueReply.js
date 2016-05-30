"use strict";
var PurgeQueueReply = (function () {
    function PurgeQueueReply(channel, deleteQueue) {
        this.channel = channel;
        this.messageCount = deleteQueue.messageCount;
    }
    return PurgeQueueReply;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PurgeQueueReply;
