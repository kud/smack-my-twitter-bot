import Twit from 'twit'

import _ from 'lodash'
import chalk from 'chalk'
import moment from 'moment'

import settings from '../../settings.json'
const {
  api: apiSettings,
  bot: botSettings,
  recipient: recipientSettings,
} = settings

import apisService from './apis'
import logService from './log'

const tweetService = {
  debug(tweet) {
    logService.message({
      title: 'Debug',
      message: tweet,
    })
  },

  displayStream(tweet) {
    logService.message({
      title: 'Stream',
      subtitle: `@${tweet.user.screen_name}`,
      message: tweet.text,
    })
  },

  displayReply(tweet, message) {
    logService.info({
      title: 'Tweet',
      subtitle: `@${tweet.user.screen_name}`,
      message: tweet.text,
    })

    logService.success({
      title: 'Reply',
      subtitle: `@${botSettings.username}`,
      message: message,
    })
  },

  isRetweet(tweet) {
    return typeof tweet.retweeted_status !== 'undefined'
  },

  isUserBlocklisted(tweet) {
    return _.indexOf(recipientSettings.blocklist, tweet.user.screen_name) >= 0
  },

  isUserSafelisted(tweet) {
    return _.indexOf(recipientSettings.safelist, tweet.user.screen_name) < 0
  },

  isUserHasEnoughFollowers(tweet) {
    return tweet.user.followers_count >= recipientSettings.minFollowers
  },

  isUserHasEnoughYear(tweet) {
    const minYear = recipientSettings.minYear

    const currentYear = moment(new Date()).year()
    const userYear = moment(new Date(tweet.user.created_at)).year()
    const diff = currentYear - userYear

    return minYear === null || diff >= minYear
  },

  isUserProtected(tweet) {
    return tweet.user.protected
  },

  isEnglish(tweet) {
    tweet.lang === 'en'
  },

  isFrench(tweet) {
    return tweet.lang === 'fr'
  },

  isUserReplyingToBot(tweet) {
    return tweet.in_reply_to_screen_name === botSettings.username
  },

  isUserTheBot(tweet) {
    return tweet.user.screen_name === botSettings.username
  },

  reply(api, tweet, message) {
    const postParam = {
      in_reply_to_status_id: tweet.id_str,
      status: `@${tweet.user.screen_name} ${message}`,
    }

    api.post('statuses/update', postParam, (err, data, response) => {
      this.displayReply(tweet, message)

      if (err) {
        logService.error({
          message: err,
        })
      }
    })
  },
}

export default tweetService
