import chalk from 'chalk'

const logService = {
  message(opt) {
    const title = opt.title || 'Message'

    console.log(
      chalk.bgBlack(chalk.white(` ${title} `)),
      opt.subtitle ? chalk.bgWhite(chalk.black(` ${opt.subtitle} `)) : '',
      '\n\n',
      `${opt.message}`,
      '\n'
    )
  },

  info(opt) {
    const title = opt.title || 'Info'

    console.log(
      chalk.bgBlue(chalk.white(` ${title} `)),
      opt.subtitle ? chalk.bgWhite(chalk.black(` ${opt.subtitle} `)) : '',
      '\n\n',
      `${opt.message}`,
      '\n'
    )
  },

  success(opt) {
    const title = opt.title || 'Success'

    console.log(
      chalk.bgGreen(chalk.white(` ${title} `)),
      opt.subtitle ? chalk.bgWhite(chalk.black(` ${opt.subtitle} `)) : '',
      '\n\n',
      `${opt.message}`,
      '\n'
    )
  },

  error(opt) {
    const title = opt.title || 'Error'

    console.log(
      chalk.bgRed(chalk.white(` ${title} `)),
      opt.subtitle ? chalk.bgWhite(chalk.black(` ${opt.subtitle} `)) : '',
      '\n\n',
      `${opt.message}`,
      '\n'
    )
  },
}

export default logService
