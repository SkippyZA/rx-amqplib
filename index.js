'use strict';

const RxAmqpLib = require('./dist/RxAmqpLib');
const RxConnection = require('./dist/RxConnection');
const RxChannel = require('./dist/RxChannel');
const RxMessage = require('./dist/RxMessage');

module.exports.newConnection = RxAmqpLib.default.newConnection;
module.exports.RxConnection = RxConnection.default;
module.exports.RxChannel = RxChannel.default;
module.exports.RxMessage = RxMessage.default;
