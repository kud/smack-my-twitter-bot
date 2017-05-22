import Twit from 'twit'

import getRandomInt from './lib/getRandomInt'
import checkAndAnswer from './lib/checkAndAnswer'

import settings from '../settings.json'
const {
  api: apiSettings,
  bot: botSettings,
  recipient: recipientSettings,
} = settings

import tracking from './tracking.json'
tracking.push(botSettings.username) // add username to be tracked too

import tweetService from './service'

import answersRules from './rules/answers'
import streamingRules from './rules/streaming'

/**
 * Definition
 */
const api = new Twit(apiSettings)

const streamOpts = {
  track: tracking,
}

/**
 * Action!
 */
api.stream('statuses/filter', streamOpts).on('tweet', tweet => {
  // DEBUG mode
  // tweetService.debug(tweet)

  /**
   * filters
   */
  //
  if (tweetService.isUserTheBot(tweet)) return
  // blacklisted? do not answer
  if (tweetService.isUserBlacklisted(tweet)) return
  // RT? do not answer
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

  let rules

  if (tweetService.isUserReplyingToBot(tweet)) {
    rules = answersRules
  } else {
    rules = streamingRules
  }

  const answer = checkAndAnswer(tweet.text, rules)

  // tweet if there's something to answer
  if (answer !== null) {
    tweetService.answer(api, tweet, answer)
  }
})
