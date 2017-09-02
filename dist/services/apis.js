'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _twit = require('twit');

var _twit2 = _interopRequireDefault(_twit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apis = [];
var currentIndex = 0;
var max = null;

var apisService = {
  generate: function generate(settings) {
    settings.map(function (setting, i) {
      apis.push(new _twit2.default(setting));
    });

    max = apis.length;
  },
  getReader: function getReader() {
    return apis[0];
  },
  getWriter: function getWriter() {
    if (currentIndex >= max) {
      currentIndex = 0;
    }
    var api = apis[currentIndex];
    currentIndex++;

    return api;
  }
};

exports.default = apisService;