import Twit from 'twit'

let apis = []
let currentIndex = 0
let max = null

const apisService = {
  generate(settings) {
    settings.map((setting, i) => {
      apis.push(new Twit(setting))
    })

    max = apis.length
  },

  getReader() {
    return apis[0]
  },

  getWriter() {
    if (currentIndex >= max) {
      currentIndex = 0
    }
    let api = apis[currentIndex]
    currentIndex++

    return api
  },
}

export default apisService
