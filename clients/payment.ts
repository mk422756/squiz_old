import firebase from 'lib/firebase'

const db = firebase.firestore()

type PaymentData = {
  payment_method: string
  currency: string
  amount: number
  status: string
  collection_id: string
}

export const createPayment = async (uid: string, data: PaymentData) => {
  await db
    .collection('users')
    .doc(uid)
    .collection('payments')
    .add({...data, created_at: new Date()})
}
