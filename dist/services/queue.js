'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queue = [];

var queueService = {
  add: function add(el) {
    queue.push(el);

    // reset to prevent leak
    // opinionated choice, can be adjusted
    if (queue.length === 500) {
      queue = [];
    }

    _log2.default.info({
      subtitle: 'Queue',
      message: 'Length: ' + queue.length
    });
  },
  start: function start(seconds) {
    setInterval(function () {
      var el = queue.shift();
      if (el !== undefined) {
        el();
      }
    }, seconds * 1000);
  }
};

exports.default = queueService;