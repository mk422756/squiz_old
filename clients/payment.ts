import firebase from 'lib/firebase'
import cuid from 'cuid'
import {PaymentMethod} from 'models/paymentMethod'

const functions = firebase.functions()
const db = firebase.firestore()

type PaymentData = {
  payment_method: string
  currency: string
  amount: number
  status: string
  collection_id: string
}

export const createPayment = async (data: PaymentData) => {
  const id = cuid()
  const createPayment = functions.httpsCallable('payment-createStripePayment')
  await createPayment({...data, id})
}

export const createPaymentMethod = async (paymentMethodId: string) => {
  const id = cuid()
  const createPaymentMethod = functions.httpsCallable(
    'payment-createStripePaymentMethod'
  )
  await createPaymentMethod({id, paymentMethodId})
}

export const getPaymentMethods = async (
  userId: string
): Promise<PaymentMethod[]> => {
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('paymentMethods')
    .get()

  return snapshot.docs.map(
    (doc): PaymentMethod => {
      const data = doc.data()
      return {id: doc.id, paymentMethodId: data.id, last4: data.card.last4}
    }
  )
}
