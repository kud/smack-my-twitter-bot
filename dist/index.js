'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _settings = require('../settings.json');

var _settings2 = _interopRequireDefault(_settings);

var _rules = require('../rules.json');

var _rules2 = _interopRequireDefault(_rules);

var _sentence = require('../sentence.json');

var _sentence2 = _interopRequireDefault(_sentence);

var _tweet = require('./services/tweet');

var _tweet2 = _interopRequireDefault(_tweet);

var _apis = require('./services/apis');

var _apis2 = _interopRequireDefault(_apis);

var _queue = require('./services/queue');

var _queue2 = _interopRequireDefault(_queue);

var _rules3 = require('./services/rules');

var _rules4 = _interopRequireDefault(_rules3);

var _reply = require('./services/reply');

var _reply2 = _interopRequireDefault(_reply);

var _log = require('./services/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiSettings = _settings2.default.api,
    botSettings = _settings2.default.bot,
    recipientSettings = _settings2.default.recipient;


/**
 * Definition
 */
_queue2.default.start(botSettings.timeToReply);

_apis2.default.generate(apiSettings);

var api = _apis2.default.getReader();

/**
 * Action!
 */
api.stream('statuses/filter', {
  track: _rules4.default.getTrack(_rules2.default, botSettings.username)
}).on('tweet', function (tweet) {
  // DEBUG mode
  // tweetService.debug(tweet)

  /**
   * filters
   */
  // do not reply to yourself
  if (_tweet2.default.isUserTheBot(tweet)) return;
  // blocklisted? do not reply
  if (_tweet2.default.isUserBlocklisted(tweet)) return;
  // RT? do not reply
  if (_tweet2.default.isRetweet(tweet)) return;
  // do not care about small accounts
  if (!_tweet2.default.isUserHasEnoughFollowers(tweet)) return;
  // do not care about too recent accounts
  if (!_tweet2.default.isUserHasEnoughYear(tweet)) return;
  // do not care about protected accounts
  if (_tweet2.default.isUserProtected(tweet)) return;
  // do not care about some languages
  if (!(_tweet2.default.isFrench(tweet) || _tweet2.default.isEnglish(tweet))) return;

  // show streaming
  _tweet2.default.displayStream(tweet);

  var selectedRules = _tweet2.default.isUserReplyingToBot(tweet) ? _rules4.default.getReplyScope(_rules2.default) : _rules4.default.getTrackScope(_rules2.default);

  var reply = _reply2.default.get(tweet, selectedRules, _sentence2.default);

  // tweet if there's something to reply
  if (reply !== null) {
    _queue2.default.add(function () {
      _tweet2.default.reply(_apis2.default.getWriter(), tweet, reply);
    });
  }
}).on('disconnect', function (message) {
  _log2.default.error({
    message: message
  });
}).on('error', function (message) {
  _log2.default.error({
    message: message
  });
});