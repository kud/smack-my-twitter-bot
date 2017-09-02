'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _twit = require('twit');

var _twit2 = _interopRequireDefault(_twit);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _settings = require('../../settings.json');

var _settings2 = _interopRequireDefault(_settings);

var _apis = require('./apis');

var _apis2 = _interopRequireDefault(_apis);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiSettings = _settings2.default.api,
    botSettings = _settings2.default.bot,
    recipientSettings = _settings2.default.recipient;


var tweetService = {
  debug: function debug(tweet) {
    _log2.default.message({
      title: 'Debug',
      message: tweet
    });
  },
  displayStream: function displayStream(tweet) {
    _log2.default.message({
      title: 'Stream',
      subtitle: '@' + tweet.user.screen_name,
      message: tweet.text
    });
  },
  displayReply: function displayReply(tweet, message) {
    _log2.default.info({
      title: 'Tweet',
      subtitle: '@' + tweet.user.screen_name,
      message: tweet.text
    });

    _log2.default.success({
      title: 'Reply',
      subtitle: '@' + botSettings.username,
      message: message
    });
  },
  isRetweet: function isRetweet(tweet) {
    return typeof tweet.retweeted_status !== 'undefined';
  },
  isUserBlocklisted: function isUserBlocklisted(tweet) {
    return _lodash2.default.indexOf(recipientSettings.blocklist, tweet.user.screen_name) >= 0;
  },
  isUserSafelisted: function isUserSafelisted(tweet) {
    return _lodash2.default.indexOf(recipientSettings.safelist, tweet.user.screen_name) < 0;
  },
  isUserHasEnoughFollowers: function isUserHasEnoughFollowers(tweet) {
    return tweet.user.followers_count >= recipientSettings.minFollowers;
  },
  isUserHasEnoughYear: function isUserHasEnoughYear(tweet) {
    var minYear = recipientSettings.minYear;

    var currentYear = (0, _moment2.default)(new Date()).year();
    var userYear = (0, _moment2.default)(new Date(tweet.user.created_at)).year();
    var diff = currentYear - userYear;

    return minYear === null || diff >= minYear;
  },
  isUserProtected: function isUserProtected(tweet) {
    return tweet.user.protected;
  },
  isEnglish: function isEnglish(tweet) {
    tweet.lang === 'en';
  },
  isFrench: function isFrench(tweet) {
    return tweet.lang === 'fr';
  },
  isUserReplyingToBot: function isUserReplyingToBot(tweet) {
    return tweet.in_reply_to_screen_name === botSettings.username;
  },
  isUserTheBot: function isUserTheBot(tweet) {
    return tweet.user.screen_name === botSettings.username;
  },
  reply: function reply(api, tweet, message) {
    var _this = this;

    var postParam = {
      in_reply_to_status_id: tweet.id_str,
      status: '@' + tweet.user.screen_name + ' ' + message
    };

    api.post('statuses/update', postParam, function (err, data, response) {
      _this.displayReply(tweet, message);

      if (err) {
        _log2.default.error({
          message: err
        });
      }
    });
  }
};

exports.default = tweetService;