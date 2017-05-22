import _ from 'lodash'

const track = []

const rulesService = {
  getTrack(rules, botName) {
    rules.map(rule => {
      const ruleTrack = rule.track
      if (ruleTrack !== undefined) {
        track.push(...ruleTrack)
      }
    })

    track.push(botName) // add username to be tracked too

    return track
  },

  getTrackScope(rules) {
    return _.filter(rules, rule => {
      return _.indexOf(rule.scope, 'track') >= 0
    })
  },

  getReplyScope(rules) {
    return _.filter(rules, rule => {
      return _.indexOf(rule.scope, 'reply') >= 0
    })
  },
}

export default rulesService
