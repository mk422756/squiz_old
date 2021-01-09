import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

import * as quiz from './quiz'
import * as section from './section'

exports.quiz = quiz
exports.section = section
