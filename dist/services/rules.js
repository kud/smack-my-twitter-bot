'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var track = [];

var rulesService = {
  getTrack: function getTrack(rules, botName) {
    rules.map(function (rule) {
      var ruleTrack = rule.track;
      if (ruleTrack !== undefined) {
        track.push.apply(track, _toConsumableArray(ruleTrack));
      }
    });

    track.push(botName); // add username to be tracked too

    return track;
  },
  getTrackScope: function getTrackScope(rules) {
    return _lodash2.default.filter(rules, function (rule) {
      return _lodash2.default.indexOf(rule.scope, 'track') >= 0;
    });
  },
  getReplyScope: function getReplyScope(rules) {
    return _lodash2.default.filter(rules, function (rule) {
      return _lodash2.default.indexOf(rule.scope, 'reply') >= 0;
    });
  }
};

exports.default = rulesService;