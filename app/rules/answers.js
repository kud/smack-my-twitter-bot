import fixingAnswer from '../answers/generic/fixing.json'
import gratitudeAnswer from '../answers/generic/gratitude.json'
import mistakeAnswer from '../answers/generic/mistake.json'
import smalltalkAnswer from '../answers/generic/smalltalk.json'
import toBotAnswer from '../answers/generic/toBot.json'
import toOffensiveAnswer from '../answers/generic/toOffensive.json'

import aieteAnswer from '../answers/specific/aiete.json'
import croiveAnswer from '../answers/specific/croive.json'
import croiventAnswer from '../answers/specific/croivent.json'
import cryptageAnswer from '../answers/specific/cryptage.json'
import digitalAnswer from '../answers/specific/digital.json'
import entrainAnswer from '../answers/specific/entrain.json'
import faireSensAnswer from '../answers/specific/faireSens.json'
import fdpAnswer from '../answers/specific/fdp.json'
import magasineAnswer from '../answers/specific/magasine.json'
import mereAnswer from '../answers/specific/mere.json'
import mourrirAnswer from '../answers/specific/mourrir.json'
import nikeAnswer from '../answers/specific/nike.json'
import ntmAnswer from '../answers/specific/ntm.json'
import ormiAnswer from '../answers/specific/ormi.json'
import participePassePremierGroupeAnswer
  from '../answers/specific/participePassePremierGroupe.json'
import respectAnswer from '../answers/specific/respect.json'
import soucisAnswer from '../answers/specific/soucis.json'
import stagiaireAnswer from '../answers/specific/stagiaire.json'
import surLaBonneVoixAnswer from '../answers/specific/surLaBonneVoix.json'
import tgAnswer from '../answers/specific/tg.json'
import tordAnswer from '../answers/specific/tord.json'
import trisAnswer from '../answers/specific/tris.json'

const answersRules = [
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

export default answersRules
