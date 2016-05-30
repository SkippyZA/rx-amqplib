"use strict";
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
        return Rx.Observable
            .defer(function () { return AmqpLib.connect(url, options); })
            .flatMap(function (conn) {
            // Disposable observable to close connection
            var connectionDisposer = Rx.Disposable.create(function () { return conn.close().catch(function (err) { return Rx.Observable.throw(err); }); });
            // New RxConnection stream
            var sourceConnection = Rx.Observable.of(new RxConnection_1.default(conn));
            // Stream of close events from connection
            var closeEvents = Rx.Observable.fromEvent(conn, 'close');
            // Stream of Errors from error connection event
            var errorEvents = Rx.Observable.fromEvent(conn, 'error')
                .flatMap(function (error) { return Rx.Observable.throw(error); });
            // Stream of open connections, that will emit RxConnection until a close event
            var connection = Rx.Observable
                .merge(sourceConnection, errorEvents)
                .takeUntil(closeEvents);
            // Return the disposable connection resource
            return Rx.Observable.using(function () { return connectionDisposer; }, function () { return connection; });
        });
    };
    return RxAmqpLib;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxAmqpLib;
