import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

import * as quiz from './quiz'
import * as section from './section'
import * as user from './user'

exports.quiz = quiz
exports.section = section
exports.user = user
