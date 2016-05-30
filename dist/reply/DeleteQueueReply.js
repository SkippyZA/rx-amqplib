"use strict";
var DeleteQueueReply = (function () {
    function DeleteQueueReply(channel, deleteQueue) {
        this.channel = channel;
        this.messageCount = deleteQueue.messageCount;
    }
    return DeleteQueueReply;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeleteQueueReply;
