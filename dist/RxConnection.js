"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require("rx");
var RxChannel_1 = require("./RxChannel");
/**
 * Connection to AMQP server.
 */
var RxConnection = (function () {
    /**
     * Class constructor
     *
     * @param connection
     */
    function RxConnection(connection) {
        this.connection = connection;
    }
    /**
     * Opens a channel. May fail if there are no more channels available.
     *
     * @returns {any}
     */
    RxConnection.prototype.createChannel = function () {
        var _this = this;
        return Rx.Observable.create(function (observer) {
            var channel;
            var channel$ = Rx.Observable.fromPromise(_this.connection.createChannel())
                .map(function (channel) { return new RxChannel_1.default(channel); });
            var disposable = channel$.subscribe(function (c) {
                channel = c;
                observer.onNext(c);
            }, function (e) { return observer.onError(e); });
            return function () {
                disposable.dispose();
                try {
                    channel.close();
                }
                catch (e) {
                }
            };
        });
    };
    /**
     * Close the connection cleanly. Will immediately invalidate any unresolved operations, so it's best to make sure
     * you've done everything you need to before calling this. Will be resolved once the connection, and underlying
     * socket, are closed.
     *
     * @returns Rx.Observable<void>
     */
    RxConnection.prototype.close = function () {
        return Rx.Observable.fromPromise(this.connection.close());
    };
    return RxConnection;
}());
exports.default = RxConnection;
