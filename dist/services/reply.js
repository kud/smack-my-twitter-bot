'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bloodyCompile = require('bloody-compile');

var _bloodyCompile2 = _interopRequireDefault(_bloodyCompile);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var handleReply = function handleReply(text, rule, sentence) {
  var regex = new RegExp(rule.regex, 'gi');

  if (text.search(regex) >= 0) {
    var selectedSentence = [];
    rule.sentence.map(function (i) {
      selectedSentence.push.apply(selectedSentence, _toConsumableArray(sentence[i]));
    });

    var replacement = rule.options || {};

    return (0, _bloodyCompile2.default)(_lodash2.default.sample(selectedSentence), replacement);
  } else {
    return null;
  }
};

var replyService = {
  get: function get(tweet, rules, sentence) {
    var status = null;

    var i = 0;

    while (status === null) {
      if (i == rules.length) break;

      var rule = rules[i];

      status = handleReply(tweet.text, rule, sentence);

      i++;
    }

    return status;
  }
};

exports.default = replyService;