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

import fixingAnswer from './answers/generic/fixing.json'
import gratitudeAnswer from './answers/generic/gratitude.json'
import mistakeAnswer from './answers/generic/mistake.json'
import smalltalkAnswer from './answers/generic/smalltalk.json'
import toBotAnswer from './answers/generic/toBot.json'
import toOffensiveAnswer from './answers/generic/toOffensive.json'

import aieteAnswer from './answers/specific/aiete.json'
import croiveAnswer from './answers/specific/croive.json'
import croiventAnswer from './answers/specific/croivent.json'
import cryptageAnswer from './answers/specific/cryptage.json'
import digitalAnswer from './answers/specific/digital.json'
import entrainAnswer from './answers/specific/entrain.json'
import faireSensAnswer from './answers/specific/faireSens.json'
import fdpAnswer from './answers/specific/fdp.json'
import magasineAnswer from './answers/specific/magasine.json'
import mereAnswer from './answers/specific/mere.json'
import mourrirAnswer from './answers/specific/mourrir.json'
import nikeAnswer from './answers/specific/nike.json'
import ntmAnswer from './answers/specific/ntm.json'
import ormiAnswer from './answers/specific/ormi.json'
import participePassePremierGroupeAnswer
  from './answers/specific/participePassePremierGroupe.json'
import respectAnswer from './answers/specific/respect.json'
import soucisAnswer from './answers/specific/soucis.json'
import stagiaireAnswer from './answers/specific/stagiaire.json'
import surLaBonneVoixAnswer from './answers/specific/surLaBonneVoix.json'
import tgAnswer from './answers/specific/tg.json'
import tordAnswer from './answers/specific/tord.json'
import trisAnswer from './answers/specific/tris.json'

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

  let rules = []

  if (tweetService.isUserReplyingToBot(tweet)) {
    // handle answers
    rules = [
      [/[^a-z]fdp/gi, fdpAnswer],
      [/[^a-z]tg/gi, toOffensiveAnswer.concat(tgAnswer)],
      [/(merci|pardon|désolé|desole)/gi, gratitudeAnswer],
      [/nike/gi, nikeAnswer],
      [/respect/gi, respectAnswer],
      [/(ntm|(nique|niquer) ta (mère|mere))/gi, mereAnswer.concat(ntmAnswer)],
      [/[^a-z](mere|mère)/gi, mereAnswer],
      [
        /[^a-z](gueule|ballec|blc|foutre|vtf|vtff|chier|couille|couilles)/gi,
        toOffensiveAnswer,
      ], // offensive
      [/[^a-z](robot|robots|bot|bots)/gi, toBotAnswer], // bot
      ['', smalltalkAnswer], // if no detection, answer by smalltalk
    ]
  } else {
    // handle streaming
    rules = [
      [
        /la faute (a|à|aux)/gi,
        fixingAnswer,
        { original: 'la faute à', fix: 'la faute de' },
      ],
      [
        /entrain de/gi,
        fixingAnswer.concat(entrainAnswer),
        { original: 'entrain', fix: 'en train' },
      ],
      [/recrute[\w\s]+stagiaire/gi, stagiaireAnswer, {}],
      [
        /au (coiffeur|médecin|medecin|pharmacien|notaire|dentiste|garagiste)/gi,
        fixingAnswer,
        { original: 'au', fix: 'chez' },
      ],
      [
        /[^a-z]je comprend\W/gi,
        fixingAnswer.concat(mistakeAnswer),
        { original: 'je comprend', fix: 'je comprends' },
      ],
      [
        /[^a-z]tous le monde\W/gi,
        fixingAnswer.concat(mistakeAnswer),
        { original: 'tous le monde', fix: 'tout le monde' },
      ],
      [
        /(mille|milles) lieux/gi,
        fixingAnswer.concat(mistakeAnswer),
        { original: 'mille lieux', fix: 'mille lieues' },
      ],
      [
        /bonne (appetit|appétit)/gi,
        fixingAnswer.concat(mistakeAnswer),
        { original: 'bonne appétit', fix: 'bon appétit' },
      ],
      [/\b[^a-z]voye\b/gi, mistakeAnswer, { original: 'voye' }],
      [/\b[^a-z]voyes\b/gi, mistakeAnswer, { original: 'voyes' }],
      [/[^a-z](le|du) digital/gi, digitalAnswer],
      [/[^a-z]datas/gi, fixingAnswer, { original: 'datas', fix: 'data' }],
      [/[^a-z]moi qui a /gi, fixingAnswer, { original: 'a', fix: 'ai' }],
      [/[^a-z]moi qui as /gi, fixingAnswer, { original: 'as', fix: 'ai' }],
      [
        /chiffre d\'affaire[^s]/gi,
        fixingAnswer,
        { original: "chiffre d'affaire", fix: "chiffre d'affaires" },
      ],
      [
        /[^a-z]scénarios/gi,
        fixingAnswer,
        { original: 'scénarios', fix: 'scénarii' },
      ],
      [
        /[^a-z]quelque soit/gi,
        fixingAnswer,
        { original: 'quelque soit', fix: 'quel(le)(s) que soi(en)t' },
      ],
      [/[^a-z]parmis/gi, fixingAnswer, { original: 'parmis', fix: 'parmi' }],
      [
        /[^a-z]discution/gi,
        fixingAnswer,
        { original: 'discution', fix: 'discussion' },
      ],
      [/[^a-z][^a-z]mourrir/gi, mourrirAnswer],
      [
        /[^a-z]la connection/gi,
        fixingAnswer,
        { original: 'la connection', fix: 'la connexion' },
      ],
      [/[^a-z]quizz/gi, fixingAnswer, { original: 'quizz', fix: 'quiz' }],
      [
        /j\'ai tord/gi,
        fixingAnswer.concat(tordAnswer),
        { original: "j'ai tord", fix: "j'ai tort" },
      ],
      [/[^a-z]tampis/gi, fixingAnswer, { original: 'tampis', fix: 'tant pis' }],
      [/(du|le) soucis/gi, soucisAnswer],
      [/[^a-z]ses sa/gi, soucisAnswer, { original: 'ses sa', fix: "c'est ça" }],
      [
        /[^a-z]comme (meme|même)/gi,
        fixingAnswer,
        { original: 'comme même', fix: 'quand même' },
      ],
      [/[^a-z](fait|faire) sens/gi, faireSensAnswer],
      [
        /[^a-z]aimerai bien/gi,
        fixingAnswer,
        { original: 'aimerai bien', fix: 'aimerais bien' },
      ],
      [
        /bonne anniversaire/gi,
        fixingAnswer,
        { original: 'bonne anniversaire', fix: 'bon anniversaire' },
      ],
      [
        /bon année/gi,
        fixingAnswer,
        { original: 'bon année', fix: 'bonne année' },
      ],
      [
        /quand (à|a) (lui|toi|vous|elle)/gi,
        fixingAnswer,
        { original: 'quand à', fix: 'quant à' },
      ],
      [/ai fais/gi, fixingAnswer, { original: "j'ai fais", fix: "j'ai fait" }],
      [/ai dis/gi, fixingAnswer, { original: "j'ai dis", fix: "j'ai dit" }],
      [/acceuil/gi, fixingAnswer, { original: 'acceuil', fix: 'accueil' }],
      [
        /soit disant/gi,
        fixingAnswer,
        { original: 'soit disant', fix: 'soi-disant' },
      ],
      [/croivent/gi, croiventAnswer],
      [/croive/gi, croiveAnswer],
      [
        /(?!hormis)(\bh?orm(is|i)\b)/gi,
        mistakeAnswer.concat(ormiAnswer),
        { fix: 'hormis' },
      ], // It would be better to capture the word with regex and set it automatically to original
      [
        /[^a-z]sh(é|e)ma/gi,
        mistakeAnswer.concat(fixingAnswer),
        { original: 'shéma', fix: 'schéma' },
      ],
      [
        /[^a-z]sc(é|è)nette/gi,
        mistakeAnswer.concat(fixingAnswer),
        { original: 'scénette', fix: 'saynète' },
      ],
      [
        /[^a-z]davantages/gi,
        fixingAnswer,
        { original: 'davantages', fix: "d'avantages" },
      ],
      [
        /tu tris/gi,
        fixingAnswer.concat(trisAnswer),
        { original: 'tu tris', fix: 'tu tries' },
      ],
      [
        /[^a-z](le|un|du) magasine/gi,
        fixingAnswer.concat(magasineAnswer),
        { original: 'magasine', fix: 'magazine' },
      ],
      [
        /[^a-z](le|un|du) magazin/gi,
        fixingAnswer,
        { original: 'magazin', fix: 'magasin' },
      ],
      [
        /[\s]cryptage/gi,
        fixingAnswer.concat(cryptageAnswer),
        { original: 'crytage', fix: 'chiffrement' },
      ],
      [
        /[\s]crypter/gi,
        fixingAnswer.concat(cryptageAnswer),
        { original: 'crypter', fix: 'chiffrer' },
      ],
      [/sur la bonne voix/gi, surLaBonneVoixAnswer],
    ]
  }

  const answer = checkAndAnswer(tweet.text, rules)

  // tweet if there's something to tweet
  if (answer !== null) {
    tweetService.answer(api, tweet, answer)
  }
})
