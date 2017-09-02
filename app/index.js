import chalk from 'chalk'

import settings from '../settings.json'
const {
  api: apiSettings,
  bot: botSettings,
  recipient: recipientSettings,
} = settings
import rules from '../rules.json'
import sentence from '../sentence.json'

import tweetService from './services/tweet'
import apisService from './services/apis'
import queueService from './services/queue'
import rulesService from './services/rules'
import replyService from './services/reply'
import logService from './services/log'

/**
 * Definition
 */
queueService.start(botSettings.timeToReply)

apisService.generate(apiSettings)

const api = apisService.getReader()

/**
 * Action!
 */
api
  .stream('statuses/filter', {
    track: rulesService.getTrack(rules, botSettings.username),
  })
  .on('tweet', tweet => {
    // DEBUG mode
    // tweetService.debug(tweet)

    /**
     * filters
     */
    // do not reply to yourself
    if (tweetService.isUserTheBot(tweet)) return
    // blocklisted? do not reply
    if (tweetService.isUserBlocklisted(tweet)) return
    // RT? do not reply
    if (tweetService.isRetweet(tweet)) return
    // do not care about small accounts
    if (!tweetService.isUserHasEnoughFollowers(tweet)) return
    // do not care about too recent accounts
    if (!tweetService.isUserHasEnoughYear(tweet)) return
    // do not care about protected accounts
    if (tweetService.isUserProtected(tweet)) return
    // do not care about some languages
    if (!(tweetService.isFrench(tweet) || tweetService.isEnglish(tweet))) return

    // show streaming
    tweetService.displayStream(tweet)

    const selectedRules = tweetService.isUserReplyingToBot(tweet)
      ? rulesService.getReplyScope(rules)
      : rulesService.getTrackScope(rules)

    const reply = replyService.get(tweet, selectedRules, sentence)

    // tweet if there's something to reply
    if (reply !== null) {
      queueService.add(() => {
        tweetService.reply(apisService.getWriter(), tweet, reply)
      })
    }
  })
  .on('disconnect', message => {
    logService.error({
      message: message,
    })
  })
  .on('error', message => {
    logService.error({
      message: message,
    })
  })
