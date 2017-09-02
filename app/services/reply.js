import compile from 'bloody-compile'
import _ from 'lodash'

const handleReply = (text, rule, sentence) => {
  const regex = new RegExp(rule.regex, 'gi')

  if (text.search(regex) >= 0) {
    let selectedSentence = []
    rule.sentence.map(i => {
      selectedSentence.push(...sentence[i])
    })

    const replacement = rule.options || {}

    return compile(_.sample(selectedSentence), replacement)
  } else {
    return null
  }
}

const replyService = {
  get(tweet, rules, sentence) {
    let status = null

    let i = 0

    while (status === null) {
      if (i == rules.length) break

      var rule = rules[i]

      status = handleReply(tweet.text, rule, sentence)

      i++
    }

    return status
  },
}

export default replyService
