import _ from 'lodash'
import chalk from 'chalk'
import moment from 'moment'

import settings from '../settings.json'
const { bot: botSettings, recipient: recipientSettings } = settings

import getRandomInt from './lib/getRandomInt'

const tweetService = {
  debug(tweet) {
    console.log('')
    console.log(chalk.black.bgGreen('### Tweet ###'))
    console.log(tweet)
    console.log(chalk.black.bgGreen('###  End  ###'))
    console.log('')
  },

  displayStream(tweet) {
    console.log(
      chalk.bgBlack(chalk.white(` Stream   — `)),
      chalk.bgWhite(chalk.black(` @${tweet.user.screen_name} `)),
      '\n\n',
      tweet.text,
      '\n'
    )
  },

  displayAnswer(tweet, message) {
    console.log(
      chalk.bgBlue(chalk.black(` Tweet    — `)),
      chalk.bgWhite(chalk.black(` @ ${tweet.user.screen_name} `)),
      '\n\n',
      tweet.text,
      '\n'
    )

    console.log(
      chalk.bgGreen(chalk.black(` Answer   — `)),
      chalk.bgWhite(chalk.black(` @ ${botSettings.username} `)),
      '\n\n',
      message,
      '\n'
    )
  },

  isRetweet(tweet) {
    return typeof tweet.retweeted_status !== 'undefined'
  },

  isUserBlacklisted(tweet) {
    return _.indexOf(recipientSettings.blacklist, tweet.user.screen_name) >= 0
  },

  isUserWhitelisted(tweet) {
    return _.indexOf(recipientSettings.whitelist, tweet.user.screen_name) < 0
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

  answer(api, tweet, message) {
    const postParam = {
      in_reply_to_status_id: tweet.id_str,
      status: `@${tweet.user.screen_name} ${message}`,
    }

    const timeToAnswer = getRandomInt(
      botSettings.timeToAnswer.min,
      botSettings.timeToAnswer.max
    )

    // make it not so much bot
    setTimeout(() => {
      api.post('statuses/update', postParam, (err, data, response) => {
        this.displayAnswer(tweet, message)

        if (err) {
          console.log(chalk.bgRed(chalk.black(` ${err} `)))
          console.log('\n')
        }
      })
    }, timeToAnswer)
  },
}

export default tweetService
