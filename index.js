/**
 * Import
 */
var chalk    = require('chalk')
var Twit     = require('twit')
var _        = require('lodash')
var compile  = require('bloody-compile')
var settings = require('./settings.json')
var track    = require('./track.json')
var sentence = require('./sentence.json')

/**
 * Functions
 */

/**
 * Returns a random integer between min (included) and max (excluded)
 * Using Math.round() will give you a non-uniform distribution!
 */
var getRandomInt = function( min, max ) {
  return Math.floor(Math.random() * (max - min)) + min
}


var tweetThat = function( tweet, message ) {

  // do not answer to yourself, buddy.
  if ( tweet.user.screen_name !== username ) {

    var postParam = {
      in_reply_to_status_id: tweet.id_str,
      status: "@" + tweet.user.screen_name + " " + message
    }

    // make it not so much bot
    setTimeout(function() {
      api.post('statuses/update', postParam, function( err, data, response ) {
        console.log('')
        console.log( chalk.bgBlue( chalk.black('Tweet    —') ), chalk.bgWhite( chalk.black('@' + tweet.user.screen_name ) ) + ' ' + tweet.text )
        console.log( chalk.bgGreen( chalk.black('Answer   —') ), chalk.bgWhite( chalk.black('@' + username ) ) + ' ' + message )
        if ( err ) console.log( chalk.bgRed( chalk.white('Error    —') ) , err )
        console.log('')
      })
    // }, getRandomInt( settings.timeToAnswer.min, settings.timeToAnswer.max ) )
    }, settings.timeToAnswer.max )

  }

}

/**
 * Definition
 */
var api      = new Twit( settings.twitterKeys )
var username = settings.username

var trackedWords = track
trackedWords.push( username ) // add username to be tracked

var streamParam = {
  track: trackedWords
}

console.log('') // cleaner

/**
 * Action!
 */
api
  .stream('statuses/filter', streamParam)
  .on('tweet', function( tweet ) {

    // break RT
    if ( typeof tweet.retweeted_status !== 'undefined' ) return

    // don't care about small accounts
    if ( tweet.user.followers_count < settings.followerLimit ) return

    // don't care about some languages
    if ( !(tweet.lang === 'fr' || tweet.lang === 'en') ) return

    // show tweet
    console.log( chalk.bgBlack('Stream   —'), chalk.bgWhite( chalk.black('@' + tweet.user.screen_name ) ) + ' ' + tweet.text )
    // console.log( chalk.bgBlack('Stream   —'), tweet ) // show all tweet

    var answer = undefined

    /**
     * Are you talking to me? This is my replies.
     */
    if ( tweet.in_reply_to_screen_name === username && tweet.user.screen_name !== username ) {

      // default
      var whatToSay = sentence.smalltalk

      // fdp
      if ( tweet.text.search(/[^a-z]fdp/gi) >= 0 )
        whatToSay = ["Vous parlez bien de frais de port ?"]
      // tg
      else if ( tweet.text.search(/[^a-z]tg/gi) >= 0 )
        whatToSay = sentence.offensive.concat(sentence.tg)
      // thanks
      else if ( tweet.text.search(/[^a-z]merci/gi) >= 0 )
        whatToSay = sentence.thanks
      // nike
      else if ( tweet.text.search(/[^a-z]nike/gi) >= 0 )
        whatToSay = sentence.nike
      // respect
      else if ( tweet.text.search(/[^a-z](respect|respecte)/gi) >= 0 )
        whatToSay = sentence.respect
      // ntm
      else if ( tweet.text.search(/[^a-z]ntm/gi) >= 0 || tweet.text.search(/[^a-z]nique ta (mère|mere)/gi) >= 0 )
        whatToSay = sentence.offensive.concat(sentence.ntm)
      // mother
      else if ( tweet.text.search(/[^a-z](mere|mère)/gi) >= 0)
        whatToSay = sentence.mere
      // offensive
      else if ( tweet.text.search(/[^a-z]gueule/gi) >= 0 || tweet.text.search(/[^a-z]ballec/gi) >= 0 || tweet.text.search(/[^a-z]foutre/gi) >= 0 || tweet.text.search(/[^a-z]vtf[^a-z]/gi) >= 0 || tweet.text.search(/[^a-z]chier[^a-z]/gi) >= 0 || tweet.text.search(/[^a-z](couille|couilles)[^a-z]/gi) >= 0 )
        whatToSay = sentence.offensive
      // bot? am i a bot? 0:)
      else if ( tweet.text.search(/[^a-z](robot|robots|bot|bots)/gi) >= 0 )
        whatToSay = sentence.bot

      // tweet it !
      answer = _.sample( whatToSay )

    }

    /**
     * Errrrrrrrrrror found!
     */
    // do not answer to everything, just sometimes
    else if ( getRandomInt(0,2) ) {
    // else if ( true ) {

      if ( tweet.text.search(/[^a-z](le|du) digital/ig) >= 0 ) {
        answer = _.sample( sentence.digital )
      }

      else if ( tweet.text.search(/[^a-z]autant pour moi/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'au temps pour moi', 'autant pour moi')
      }

      else if ( tweet.text.search(/[^a-z]parmis/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'parmi', 'parmis')
      }

      else if ( tweet.text.search(/[^a-z][^a-z]mourrir/ig) >= 0 ) {
        answer = sentence.mourir
      }

      else if ( tweet.text.search(/[^a-z]la faute (a|à|aux)/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'la faute de', 'la faute à')
      }

      else if ( tweet.text.search(/[^a-z]la connection/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'connexion', 'connection')
      }

      else if ( tweet.text.search(/[^a-z]j\'ai tord/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'j\'ai tort', 'j\'ai tord')
      }

      else if ( tweet.text.search(/[^a-z]sa va[^a-z]/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'ça va', 'sa va')
      }

      else if ( tweet.text.search(/[^a-z]aux (dépends|depends)/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'au dépens', 'aux dépends')
      }

      else if ( tweet.text.search(/[^a-z](malgrés|malgres)/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'malgré', 'malgrés')
      }

      else if ( tweet.text.search(/[^a-z]entrain de/ig) >= 0 ) {
        var whatToSay = sentence.fix.concat(sentence.entrain)

        answer = compile( _.sample( whatToSay ), 'en train', 'entrain')
      }

      else if ( tweet.text.search(/[^a-z]tampis/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'tant pis', 'tampis')
      }

      else if ( tweet.text.search(/(du|le) soucis/ig) >= 0 ) {
        answer = sentence.souci
      }

      else if ( tweet.text.search(/[^a-z]ses sa/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'c\'est ça', 'ses sa')
      }

      else if ( tweet.text.search(/[^a-z]comme (meme|même)/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'quand même', 'comme même')
      }

      else if ( tweet.text.search(/[^a-z]bonne anniversaire/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'bon anniversaire', 'bonne anniversaire')
      }

      else if ( tweet.text.search(/[^a-z]quand (à|a) (lui|toi|vous|elle)/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'quant à', 'quand à')
      }

      else if ( tweet.text.search(/[^a-z]ai fais/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'j\'ai fait', 'j\'ai fais')
      }

      else if ( tweet.text.search(/[^a-z]acceuil/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'accueil', 'acceuil')
      }

      else if ( tweet.text.search(/[^a-z]croivent/ig) >= 0) {
        answer = sentence.croivent
      }

      else if ( tweet.text.search(/[^a-z]croive/ig) >= 0 ) {
        answer = sentence.croive
      }

      else if ( tweet.text.search(/[^a-z]au jour d\'aujourd\'hui/ig) >= 0 ) {
        answer = sentence.aujourdaujourdhui
      }

      else if ( tweet.text.search(/[^a-z]soit disant/ig) >= 0 ) {
        var whatToSay = sentence.fix

        answer = compile( _.sample( whatToSay ), 'soi-disant', 'soit disant')
      }

    }

    // tweet if there's something to tweet
    if ( typeof answer !== 'undefined' ) {
      tweetThat( tweet, answer )
    }

  })
