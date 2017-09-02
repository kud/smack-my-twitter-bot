import chalk from 'chalk'

import logService from './log'

let queue = []

const queueService = {
  add(el) {
    queue.push(el)

    // reset to prevent leak
    // opinionated choice, can be adjusted
    if (queue.length === 500) {
      queue = []
    }

    logService.info({
      subtitle: 'Queue',
      message: `Length: ${queue.length}`,
    })
  },

  start(seconds) {
    setInterval(() => {
      const el = queue.shift()
      if (el !== undefined) {
        el()
      }
    }, seconds * 1000)
  },
}

export default queueService
