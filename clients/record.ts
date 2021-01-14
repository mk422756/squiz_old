import firebase from 'lib/firebase'
import dayjs from 'dayjs'

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
        records: firebase.firestore.FieldValue.increment(1),
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
        records: firebase.firestore.FieldValue.increment(1),
        correct: firebase.firestore.FieldValue.increment(isCorrect ? 1 : 0),
        incorrect: firebase.firestore.FieldValue.increment(isCorrect ? 0 : 1),
      })
  }
}
