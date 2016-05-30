"use strict";
var AssertExchangeReply = (function () {
    function AssertExchangeReply(channel, reply) {
        this.channel = channel;
        this.exchange = reply.exchange;
    }
    return AssertExchangeReply;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AssertExchangeReply;
