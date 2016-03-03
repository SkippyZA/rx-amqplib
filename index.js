'use strict';

var RxAmqpLib = require('./dist/RxAmqpLib');
var RxConnection = require('./dist/RxConnection');
var RxChannel = require('./dist/RxChannel');
var RxMessage = require('./dist/RxMessage');

module.exports.newConnection = RxAmqpLib.default.newConnection;
module.exports.RxConnection = RxConnection.default;
module.exports.RxChannel = RxChannel.default;
module.exports.RxMessage = RxMessage.default;
