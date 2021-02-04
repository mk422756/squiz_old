import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const firestore = admin.firestore()

import {Stripe} from 'stripe'
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2020-08-27',
})

exports.createStripePayment = functions.https.onCall(async (data, context) => {
  const {id, amount, currency, payment_method, collection_id} = data

  const userId = context.auth?.uid
  if (!userId) {
    return
  }

  try {
    // Look up the Stripe customer id.
    const stripeData = await firestore
      .collection('users')
      .doc(userId)
      .collection('secrets')
      .doc('stripe')
      .get()

    const data = stripeData.data()
    if (!data) {
      return
    }
    const customer = data.customer_id

    // Create a charge using the pushId as the idempotency key
    // to protect against double charges.
    const idempotencyKey = id
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

    const promise1 = firestore
      .collection('users')
      .doc(userId)
      .collection('payments')
      .doc(id)
      .set({
        ...payment,
        collection_id,
        created_at: new Date(),
      })

    const promise2 = firestore.collection('purchased').add({
      userId,
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
    await firestore
      .collection('users')
      .doc(userId)
      .collection('payments')
      .doc(id)
      .set({error: userFacingMessage(error)}, {merge: true})

    throw new functions.https.HttpsError(
      'cancelled',
      'Payment failed: ' + userFacingMessage(error)
    )
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

/**
 * this function is triggered to retrieve the payment method details.
 */
exports.createStripePaymentMethod = functions.https.onCall(
  async (data, context) => {
    const {id, paymentMethodId} = data

    const userId = context.auth?.uid
    if (!userId) {
      return
    }

    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentMethodId
      )
      await firestore
        .collection('users')
        .doc(userId)
        .collection('paymentMethods')
        .doc(id)
        .set(paymentMethod)

      // Create a new SetupIntent so the customer can add a new method next time.
      const intent = await stripe.setupIntents.create({
        customer: `${paymentMethod.customer}`,
      })

      await firestore
        .collection('users')
        .doc(userId)
        .collection('secrets')
        .doc('stripe')
        .set(
          {
            setup_secret: intent.client_secret,
          },
          {merge: true}
        )
      return
    } catch (error) {
      console.log(error)
      await firestore
        .collection('users')
        .doc(userId)
        .collection('paymentMethods')
        .doc(id)
        .set({error: userFacingMessage(error)}, {merge: true})
      // await reportError(error, {user: context.params.userId})
      throw new functions.https.HttpsError(
        'cancelled',
        'Create payment method failed: ' + userFacingMessage(error)
      )
    }
  }
)
