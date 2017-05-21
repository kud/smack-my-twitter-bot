import handleAnswer from './handleAnswer'

/**
 * Check the text and answer it.
 * @param  {[type]} text
 * @param  {[type]} rules
 * @return {string}
 * ex:
 *   - text = 'hello sa va'
 *   - rules = [
 *      [/[^a-z]nope[^a-z]/ig, ['nope']],
 *      [/[^a-z]sa va[^a-z]/ig, ['pas d\'accord']]
 *    ]
 */
const checkAndAnswer = function(text, rules) {
  let status = null

  let i = 0

  while (status === null) {
    if (i == rules.length) break

    var rule = rules[i]

    if (rule.length === 3) {
      status = handleAnswer(text, rule[0], rule[1], rule[2])
    } else {
      status = handleAnswer(text, rule[0], rule[1])
    }

    i++
  }

  return status
}

export default checkAndAnswer
