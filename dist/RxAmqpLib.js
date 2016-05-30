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
            return Rx.Observable.using(function () { return Rx.Disposable.create(function () { return conn.close(); }); }, function (resource) {
                return Rx.Observable.merge(Rx.Observable.of(new RxConnection_1.default(conn)), Rx.Observable.fromEvent(conn, 'error').flatMap(function (e) { return Rx.Observable.throw(e); }))
                    .takeUntil(Rx.Observable.fromEvent(conn, 'close'));
            });
        });
    };
    return RxAmqpLib;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxAmqpLib;
