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
        return Rx.Observable.create(function (obs) {
            var openConn;
            var sub = Rx.Observable.fromPromise(AmqpLib.connect(url, options))
                .subscribe(function (conn) {
                openConn = conn;
                conn.on('error', function (e) {
                    openConn = undefined;
                    obs.onError(e);
                });
                conn.on('close', function () {
                    openConn = undefined;
                    obs.onCompleted();
                });
                obs.onNext(new RxConnection_1.default(conn));
            }, function (e) { return obs.onError(e); });
            return function () {
                sub.dispose();
                openConn && openConn.close();
            };
        });
    };
    return RxAmqpLib;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxAmqpLib;
