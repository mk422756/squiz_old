import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const firestore = admin.firestore()

import {Stripe} from 'stripe'
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2020-08-27',
})

exports.createStripePayment = functions.firestore
  .document('users/{userId}/payments/{pushId}')
  .onCreate(async (snap, context) => {
    const {amount, currency, payment_method, collection_id} = snap.data()
    try {
      // Look up the Stripe customer id.
      const stripeData = await firestore
        .collection('users')
        .doc(context.params.userId)
        .collection('secrets')
        .doc('stripe')
        .get()

      const data = stripeData.data()
      if (!data) {
        return
      }
      const customer = data.customer_id
      // const customer = (await snap.ref.parent.parent.get()).data().customer_id
      // Create a charge using the pushId as the idempotency key
      // to protect against double charges.
      const idempotencyKey = context.params.pushId
      const payment = await stripe.paymentIntents.create(
        {
          amount,
          currency,
          customer,
          payment_method,
          off_session: false,
          confirm: true,
          confirmation_method: 'manual',
        },
        {idempotencyKey}
      )
      // If the result is successful, write it back to the database.
      const promise1 = snap.ref.set({
        ...payment,
        collection_id,
        updated_at: new Date(),
      })
      const promise2 = firestore.collection('purchased').add({
        userId: context.params.userId,
        collectionId: collection_id,
        amount,
        paymentId: payment.id,
        createdAt: new Date(),
      })

      await Promise.all([promise1, promise2])
    } catch (error) {
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception with StackDriver
      console.log(error)
      await snap.ref.set({error: userFacingMessage(error)}, {merge: true})
      // await reportError(error, {user: context.params.userId})
    }
  })

/**
 * When 3D Secure is performed, we need to reconfirm the payment
 * after authentication has been performed.
 *
 * @see https://stripe.com/docs/payments/accept-a-payment-synchronously#web-confirm-payment
 */
exports.confirmStripePayment = functions.firestore
  .document('users/{userId}/payments/{pushId}')
  .onUpdate(async (change, context) => {
    if (change.after.data().status === 'requires_confirmation') {
      const payment = await stripe.paymentIntents.confirm(
        change.after.data().id
      )
      change.after.ref.set(payment)
    }
  })

function userFacingMessage(error: any) {
  return error.type
    ? error.message
    : 'An error occurred, developers have been alerted'
}
