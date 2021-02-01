import firebase from 'lib/firebase'
import {User} from 'models/user'
import {PaymentSecret} from 'models/paymentSecret'
import {PurchasedCollectionInfo} from 'models/purchasedCollectionInfo'
import {putFile} from 'utils/firebaseStorage'

const db = firebase.firestore()

export const createUser = async (uid: string) => {
  await db
    .collection('users')
    .doc(uid)
    .set({name: 'no name', createdAt: new Date(), updatedAt: new Date()})
}

export const updateUser = async (
  uid: string,
  name: string,
  description: string,
  twitterId: string,
  facebookId: string,
  imageBlob?: Blob
) => {
  let imageUrl = ''
  if (imageBlob) {
    imageUrl = await putFile(`users/${uid}/user_image`, imageBlob)
  }
  await db.collection('users').doc(uid).set(
    {
      name,
      description,
      twitterId,
      facebookId,
      imageUrl,
      updatedAt: new Date(),
    },
    {merge: true}
  )
}

export const getUser = async (uid: string): Promise<User | null> => {
  if (!uid) {
    return null
  }
  const ret = await db.collection('users').doc(uid).get()
  if (!ret.exists) {
    return null
  }
  const data = ret.data()
  if (!data) {
    return null
  }
  return {
    id: ret.id,
    name: data.name || '',
    description: data.description || '',
    twitterId: data.twitterId || '',
    facebookId: data.facebookId || '',
    imageUrl: data.imageUrl || '',
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.createdAt?.toDate() || new Date(),
  }
}

export const getPurchasedCollectionIds = async (
  uid: string
): Promise<PurchasedCollectionInfo[]> => {
  const snapshot = await db
    .collection('purchased')
    .where('userId', '==', uid)
    .get()

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      collectionId: data.collectionId || '',
      purchasedAt: data.createdAt?.toDate() || new Date(),
    }
  })
}

export const getPaymentSecret = async (
  uid: string
): Promise<PaymentSecret | null> => {
  const snapshot = await db
    .collection('users')
    .doc(uid)
    .collection('secrets')
    .doc('stripe')
    .get()

  if (!snapshot.exists) {
    return null
  }

  const data = snapshot.data()
  if (!data) {
    return null
  }
  return {
    customerId: data.customer_id,
    setupSecret: data.setup_secret,
  }
}
