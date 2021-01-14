import firebase from 'lib/firebase'
import dayjs from 'dayjs'
import {Record} from 'models/record'

const db = firebase.firestore()

export const addRecord = async (userId: string, isCorrect: boolean) => {
  const date = dayjs().format('YYYYMMDD')

  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('records')
    .doc(date)
    .get()

  if (snapshot.exists) {
    await db
      .collection('users')
      .doc(userId)
      .collection('records')
      .doc(date)
      .update({
        answerCount: firebase.firestore.FieldValue.increment(1),
        correct: firebase.firestore.FieldValue.increment(isCorrect ? 1 : 0),
        incorrect: firebase.firestore.FieldValue.increment(isCorrect ? 0 : 1),
      })
  } else {
    await db
      .collection('users')
      .doc(userId)
      .collection('records')
      .doc(date)
      .set({
        date,
        answerCount: firebase.firestore.FieldValue.increment(1),
        correct: firebase.firestore.FieldValue.increment(isCorrect ? 1 : 0),
        incorrect: firebase.firestore.FieldValue.increment(isCorrect ? 0 : 1),
      })
  }
}

export const getRecords = async (userId: string): Promise<Record[]> => {
  const date = dayjs().format('YYYYMMDD')

  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('records')
    // .where('date', '>', '20210101')
    .get()

  return snapshot.docs.map((doc) => {
    return snapshotToRecord(doc)
  })

  return []
}

const snapshotToRecord = (
  snapshot: firebase.firestore.DocumentSnapshot
): Record => {
  const data = snapshot.data()
  return {
    date: data.date,
    answerCount: data.answerCount,
    correct: data.correct,
    incorrect: data.incorrect,
  }
}
