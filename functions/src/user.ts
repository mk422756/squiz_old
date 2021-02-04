import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const firestore = admin.firestore()
import Stripe from 'stripe'

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2020-08-27',
})
/**
 * ユーザー作成
 */
exports.onCreateUser = functions.auth.user().onCreate(async (user) => {
  return await createStripeUser(user)
})

async function createStripeUser(user: admin.auth.UserRecord) {
  const customer = await stripe.customers.create({email: user.email})
  const intent = await stripe.setupIntents.create({
    customer: customer.id,
  })
  await firestore
    .collection('users')
    .doc(user.uid)
    .collection('secrets')
    .doc('stripe')
    .set({
      customer_id: customer.id,
      setup_secret: intent.client_secret,
    })
}

/**
 * ユーザー削除
 */
exports.onDeleteUser = functions.auth.user().onDelete(async (user) => {
  await cleanupStripeUser(user)

  // TODO delete other documents

  return await firestore.collection('users').doc(user.uid).delete()
})

async function cleanupStripeUser(user: admin.auth.UserRecord) {
  const stripeSnapshot = await firestore
    .collection('users')
    .doc(user.uid)
    .collection('secrets')
    .doc('stripe')
    .get()
  const customer = stripeSnapshot.data()
  if (!customer) {
    return
  }
  await stripe.customers.del(customer.customer_id)
  // Delete the customers payments & payment methods in firestore.
  const snapshot = await firestore
    .collection('users')
    .doc(user.uid)
    .collection('paymentMethods')
    .get()
  snapshot.forEach((snap) => snap.ref.delete())
}
