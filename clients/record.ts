import firebase from 'lib/firebase'
import dayjs from 'dayjs'
import {Record} from 'models/record'
import {nullableArray2NonullableArray} from 'utils/array'

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

export const getRecordsByYearMonth = async (
  userId: string,
  date: Date
): Promise<Record[]> => {
  const firstDate = dayjs(date).startOf('month')
  const lastDate = dayjs(date).endOf('month')

  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('records')
    .where('date', '>=', firstDate.format('YYYYMMDD'))
    .where('date', '<=', lastDate.format('YYYYMMDD'))
    .orderBy('date', 'asc')
    .get()

  const records = snapshot.docs.map((doc) => {
    return snapshotToRecord(doc)
  })

  return fillRecordsGap(nullableArray2NonullableArray(records), lastDate)
}

const fillRecordsGap = (original: Record[], lastDate: dayjs.Dayjs) => {
  const records = [...original]
  for (let i = 1; i <= lastDate.date(); i++) {
    const ret = records.find((record) => {
      return Number(record.date.substr(6, 2)) === i
    })
    if (!ret) {
      records.push({
        date: dayjs(
          `${lastDate.year()}-${lastDate.month() + 1}-${i}`,
          'YYYY-MM-D'
        ).format('YYYYMMDD'),
        answerCount: 0,
        correct: 0,
        incorrect: 0,
      })
    }
  }

  records.sort((a, b): number => {
    return a.date > b.date ? 1 : -1
  })

  return records
}

const snapshotToRecord = (
  snapshot: firebase.firestore.DocumentSnapshot
): Record | null => {
  const data = snapshot.data()
  if (!data) {
    return null
  }
  return {
    date: data.date,
    answerCount: data.answerCount,
    correct: data.correct,
    incorrect: data.incorrect,
  }
}
