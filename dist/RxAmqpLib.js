var Rx = require('rx');
var AmqpLib = require('amqplib');
var RxConnection_1 = require('./RxConnection');
/**
 * Factory for RxAmqpLib.
 */
var RxAmqpLib = (function () {
    function RxAmqpLib() {
    }
    /**
     * Create a new instance of RxConnection, which wraps the amqplib Connection obj.
     *
     * @param url URL to AMQP host. eg: amqp://localhost/
     * @param options Custom AMQP options
     * @returns {RxConnection}
     */
    RxAmqpLib.newConnection = function (url, options) {
        // Doing it like this to make it a cold observable. When starting with the promise directly, the node application
        // stays open as AmqpLib connects straight away, and not when you subscribe to the stream.
        return Rx.Observable.just(true)
            .flatMap(function () { return Rx.Observable.fromPromise(AmqpLib.connect(url, options)); })
            .map(function (connection) { return new RxConnection_1.default(connection); });
    };
    return RxAmqpLib;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxAmqpLib;
