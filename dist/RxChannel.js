"use strict";
var Rx = require('rx');
var AssertQueueReply_1 = require('./reply/AssertQueueReply');
var AssertExchangeReply_1 = require('./reply/AssertExchangeReply');
var EmptyReply_1 = require('./reply/EmptyReply');
var RxMessage_1 = require('./RxMessage');
var DeleteQueueReply_1 = require('./reply/DeleteQueueReply');
var PurgeQueueReply_1 = require('./reply/PurgeQueueReply');
/**
 * AMQP Rx Channel
 */
var RxChannel = (function () {
    /**
     * Class constructor.
     *
     * @param channel
     */
    function RxChannel(channel) {
        this.channel = channel;
    }
    /**
     * Close a channel.
     *
     * @returns Rx.Observable<void>
     */
    RxChannel.prototype.close = function () {
        return Rx.Observable.fromPromise(this.channel.close());
    };
    /**
     * Assert a queue into existence.
     *
     * This operation is idempotent given identical arguments; however, it will bork the channel if the queue already
     * exists but has different properties.
     *
     * @param queue
     * @param options
     * @returns Rx.Observable<AssertQueueReply>
     */
    RxChannel.prototype.assertQueue = function (queue, options) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.assertQueue(queue, options))
            .map(function (reply) { return new AssertQueueReply_1.default(_this, reply); });
    };
    /**
     * Check whether a queue exists. This will bork the channel if the named queue doesn't exist; if it does exist,
     * you go through to the next round!
     *
     * @param queue
     * @returns Rx.Observable<AssertQueueReply>
     */
    RxChannel.prototype.checkQueue = function (queue) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.checkQueue(queue))
            .map(function (reply) { return new AssertQueueReply_1.default(_this, reply); });
    };
    /**
     * Delete the queue named. Naming a queue that doesn't exist will result in the server closing the channel, to teach
     * you a lesson (except in RabbitMQ version 3.2.0 and after1). The options here are:
     *
     * - `ifUnused` (boolean): if true and the queue has consumers, it will not be deleted and the channel will be
     *    closed. Defaults to false.
     * - `ifEmpty` (boolean): if true and the queue contains messages, the queue will not be deleted and the channel
     *    will be closed. Defaults to false.
     *
     * @param queue
     * @param options
     * @returns Rx.Observable<DeleteQueueReply>
     */
    RxChannel.prototype.deleteQueue = function (queue, options) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.deleteQueue(queue, options))
            .map(function (reply) { return new DeleteQueueReply_1.default(_this, reply); });
    };
    /**
     * Remove all undelivered messages from the queue named. Note that this won't remove messages that have been
     * delivered but not yet acknowledged; they will remain, and may be requeued under some circumstances (e.g., if the
     * channel to which they were delivered closes without acknowledging them).
     *
     * @param queue
     * @returns Rx.Observable<PurgeQueueReply>
     */
    RxChannel.prototype.purgeQueue = function (queue) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.purgeQueue(queue))
            .map(function (reply) { return new PurgeQueueReply_1.default(_this, reply); });
    };
    /**
     * Assert a routing path from an exchange to a queue. The exchanged named by `source` will relay messages to the
     * `queue` name, according to the type of the exchange and the `pattern` given.
     *
     * @param queue
     * @param source
     * @param pattern
     * @param args
     * @returns Rx.Observable<EmptyReply>
     */
    RxChannel.prototype.bindQueue = function (queue, source, pattern, args) {
        var _this = this;
        return Rx.Observable.just(this.channel.bindQueue(queue, source, pattern, args))
            .map(function () { return new EmptyReply_1.default(_this); });
    };
    /**
     * Remove a routing path between the queue named and the exchange named as source with the pattern and arguments
     * given. Omitting args is equivalent to supplying an empty object (no arguments). Beware: attempting to unbind
     * when there is no such binding may result in a punitive error.
     *
     * @param queue
     * @param source
     * @param pattern
     * @param args
     * @returns Rx.Observable<EmptyRole>
     */
    RxChannel.prototype.unbindQueue = function (queue, source, pattern, args) {
        var _this = this;
        return Rx.Observable.just(this.channel.unbindQueue(queue, source, pattern, args))
            .map(function () { return new EmptyReply_1.default(_this); });
    };
    /**
     * Assert an exchange into existence.
     *
     * @param exchange
     * @param type
     * @param options
     * @returns {Rx.Observable<AssertExchangeReply>}
     */
    RxChannel.prototype.assertExchange = function (exchange, type, options) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.assertExchange(exchange, type, options))
            .map(function (reply) { return new AssertExchangeReply_1.default(_this, reply); });
    };
    ;
    /**
     * Check that an exchange exists. If it doesn't exist, the channel will be closed with an error. If it does exist,
     * happy days.
     *
     * @param exchange
     * @returns Rx.Observable<EmptyReply>
     */
    RxChannel.prototype.checkExchange = function (exchange) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.checkExchange(exchange))
            .map(function (reply) { return new EmptyReply_1.default(_this); });
    };
    /**
     * Delete an exchange. The only meaningful field in options is:
     *
     * - `ifUnused` (boolean): if true and the exchange has bindings, it will not be deleted and the channel will be
     *    closed.
     *
     * If the exchange does not exist, a channel error is raised (RabbitMQ version 3.2.0 and after will not raise an
     * error).
     *
     * @param exchange
     * @param options
     * @returns Rx.Observable<EmptyReply>
     */
    RxChannel.prototype.deleteExchange = function (exchange, options) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.deleteExchange(exchange, options))
            .map(function (reply) { return new EmptyReply_1.default(_this); });
    };
    /**
     * Bind an exchange to another exchange. The exchange named by destination will receive messages from the exchange
     * named by source, according to the type of the source and the pattern given. For example, a direct exchange will
     * relay messages that have a routing key equal to the pattern.
     *
     * @param destination
     * @param source
     * @param pattern
     * @param args
     * @returns Rx.Observable<EmptyReply>
     */
    RxChannel.prototype.bindExchange = function (destination, source, pattern, args) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.bindExchange(destination, source, pattern, args))
            .map(function (reply) { return new EmptyReply_1.default(_this); });
    };
    /**
     * Remove a binding from an exchange to another exchange. A binding with the exact source exchange, destination
     * exchange, routing key pattern, and extension args will be removed. If no such binding exists, it's – you guessed
     * it – a channel error
     *
     * @param destination
     * @param source
     * @param pattern
     * @param args
     * @returns Rx.Observable<EmtpyReply>
     */
    RxChannel.prototype.unbindExchange = function (destination, source, pattern, args) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.unbindExchange(destination, source, pattern, args))
            .map(function (reply) { return new EmptyReply_1.default(_this); });
    };
    /**
     * Publish a single message to an exchange.
     *
     * @param exchange
     * @param routingKey
     * @param content
     * @param options
     * @returns boolean
     */
    RxChannel.prototype.publish = function (exchange, routingKey, content, options) {
        return this.channel.publish(exchange, routingKey, content, options);
    };
    /**
     * Send a single message with the content given as a buffer to the specific queue named, bypassing routing.
     *
     * @param queue
     * @param message
     * @param options
     * @returns boolean
     */
    RxChannel.prototype.sendToQueue = function (queue, message, options) {
        return this.channel.sendToQueue(queue, message, options);
    };
    ;
    /**
     * Set up a consumer where each message will emit an observable of `RxMessage`
     *
     * @param queue
     * @param options
     * @returns {Rx.Observable<RxMessage>}
     */
    RxChannel.prototype.consume = function (queue, options) {
        var _this = this;
        return Rx.Observable.create(function (observer) {
            var tag, close$ = Rx.Observable.fromEvent(_this.channel, 'close'), closeSub = close$.subscribe(function () { return observer.onCompleted(); });
            _this.channel.consume(queue, function (msg) {
                observer.onNext(new RxMessage_1.default(msg, _this));
            }, options).then(function (r) { return tag = r.consumerTag; });
            return function () {
                closeSub.dispose();
                try {
                    _this.cancel(tag);
                }
                catch (e) { } // This prevents a race condition
            };
        });
    };
    /**
     * This instructs the server to stop sending messages to the consumer identified by consumerTag. Messages may arrive
     * between sending this and getting its reply; once the reply has resolved, however, there will be no more messages
     * for the consumer, i.e., the message callback will no longer be invoked.
     *
     * @param consumerTag
     * @returns Rx.Observable<EmptyReply>
     */
    RxChannel.prototype.cancel = function (consumerTag) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.cancel(consumerTag))
            .map(function (reply) { return new EmptyReply_1.default(_this); });
    };
    /**
     * Ask a queue for a message, as an RPC. This will be resolved with either false, if there is no message to be had
     * (the queue has no messages ready), or a message in the same shape as detailed in #consume.
     *
     * Options:
     * - noAck (boolean): if true, the message will be assumed by the server to be acknowledged (i.e., dequeued) as soon
     *    as it's been sent over the wire. Default is false, that is, you will be expected to acknowledge the message.
     *
     * @TODO: Review this comment
     * @param queue
     * @param options
     * @returns Rx.Observable<RxMessage>
     */
    RxChannel.prototype.get = function (queue, options) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.get(queue, options))
            .filter(function (message) { return message !== false; })
            .map(function (message) { return new RxMessage_1.default(message, _this); });
    };
    /**
     * Acknowledge the given message, or all messages up to and including the given message.
     *
     * @param message
     * @param allUpTo
     * @returns void
     */
    RxChannel.prototype.ack = function (message, allUpTo) {
        return this.channel.ack(message, allUpTo);
    };
    /**
     * Acknowledge all outstanding messages on the channel. This is a "safe" operation, in that it won't result in an
     * error even if there are no such messages.
     */
    RxChannel.prototype.ackAll = function () {
        return this.channel.ackAll();
    };
    /**
     * Reject a message. This instructs the server to either requeue the message or throw it away (which may result in
     * it being dead-lettered).
     *
     * If allUpTo is truthy, all outstanding messages prior to and including the given message are rejected
     * If requeue is truthy, the server will try to put the message or messages back on the queue or queues from which
     * they came.
     *
     * @param message
     * @param allUpTo
     * @param requeue
     */
    RxChannel.prototype.nack = function (message, allUpTo, requeue) {
        return this.channel.nack(message, allUpTo, requeue);
    };
    /**
     * Reject all messages outstanding on this channel. If requeue is truthy, or omitted, the server will try to
     * re-enqueue the messages.
     *
     * @param requeue
     */
    RxChannel.prototype.nackAll = function (requeue) {
        return this.channel.nackAll(requeue);
    };
    /**
     * Reject a message.
     *
     * @param message
     * @param requeue
     */
    RxChannel.prototype.reject = function (message, requeue) {
        return this.channel.reject(message, requeue);
    };
    /**
     * Set the prefetch count for this channel. The count given is the maximum number of messages sent over the channel
     * that can be awaiting acknowledgement; once there are count messages outstanding, the server will not send more
     * messages on this channel until one or more have been acknowledged. A falsey value for count indicates no such
     * limit.
     *
     * @param count
     * @param global
     * @returns {Rx.Observable<EmptyReply>}
     */
    RxChannel.prototype.prefetch = function (count, global) {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.prefetch(count, global))
            .map(function (reply) { return new EmptyReply_1.default(_this); });
    };
    /**
     * Requeue unacknowledged messages on this channel.
     *
     * @returns Rx.Observabel<EmptyReply>
     */
    RxChannel.prototype.recover = function () {
        var _this = this;
        return Rx.Observable.fromPromise(this.channel.recover())
            .map(function (reply) { return new EmptyReply_1.default(_this); });
    };
    return RxChannel;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxChannel;
