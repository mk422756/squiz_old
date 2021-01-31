import firebase from 'lib/firebase'
import cuid from 'cuid'

const functions = firebase.functions()

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
