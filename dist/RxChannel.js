var Rx = require('rx');
var AssertQueueReply_1 = require('./reply/AssertQueueReply');
var AssertExchangeReply_1 = require('./reply/AssertExchangeReply');
var EmptyReply_1 = require('./reply/EmptyReply');
var RxMessage_1 = require('./RxMessage');
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
            _this.channel.consume(queue, function (msg) {
                observer.onNext(new RxMessage_1.default(msg, _this));
            }, options);
        });
    };
    /**
     * Close a channel.
     *
     * @returns Rx.Observable<void>
     */
    RxChannel.prototype.close = function () {
        return Rx.Observable.fromPromise(this.channel.close());
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
     * Acknowledge the given message, or all messages up to and including the given message.
     *
     * @param message
     * @param allUpTo
     * @returns void
     */
    RxChannel.prototype.ack = function (message, allUpTo) {
        return this.channel.ack(message, allUpTo);
    };
    return RxChannel;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxChannel;
