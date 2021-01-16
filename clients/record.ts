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

  // const arr: Record[] = []
  // const min = 5
  // const max = 500

  // for (let i = 1; i < 31; i++) {
  //   const correct = Math.floor(Math.random() * (max + 1 - min)) + min
  //   const incorrect = Math.floor(Math.random() * (max + 1 - min)) + min
  //   arr.push({
  //     date: i + '日',
  //     answerCount: correct + incorrect,
  //     correct,
  //     incorrect,
  //   })
  // }

  // return arr
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
