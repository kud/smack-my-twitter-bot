import compile from 'bloody-compile'
import _ from 'lodash'

/**
 * Handle what to answer
 * @param  {string} text          text to check
 * @param  {regex} regex
 * @param  {array} answer         list of answers
 * @param  {object} replacement
 * @return {string|false}
 */
const handleAnswer = (text, regex, answers, replacement) => {
  if (text.search(regex) >= 0) {
    return compile(_.sample(answers), replacement)
  } else {
    return null
  }
}

export default handleAnswer
