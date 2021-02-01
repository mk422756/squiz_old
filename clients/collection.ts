import firebase from 'lib/firebase'
import cuid from 'cuid'
import {Collection, PurchasedCollection} from 'models/collection'
import {putFile} from 'utils/firebaseStorage'
import {nullableArray2NonullableArray} from 'utils/array'

const db = firebase.firestore()

export const createCollection = async (
  title: string,
  description: string,
  creatorId: string
) => {
  const id = cuid()
  await db.collection('collections').doc(id).set({
    title,
    description,
    creatorId,
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return id
}

export const updateCollection = async (
  id: string,
  title: string,
  description: string,
  creatorId: string,
  isPublic: boolean,
  needPayment: boolean,
  price: number,
  tags: string[],
  imageBlob?: Blob
) => {
  const imageUrl = imageBlob
    ? await putFile(`collections/${id}/collection_image`, imageBlob)
    : ''
  await db.collection('collections').doc(id).set(
    {
      title,
      description,
      creatorId,
      isPublic,
      needPayment,
      price,
      tags,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {merge: true}
  )
  return id
}

export const getCollection = async (id: string): Promise<Collection | null> => {
  const snapshot = await db.collection('collections').doc(id).get()
  if (!snapshot.exists) {
    return null
  }
  return snapshotToCollection(snapshot)
}

export const getCollections = async (): Promise<Collection[]> => {
  const snapshot = await db.collection('collections').get()

  const collections = snapshot.docs.map((doc) => {
    return snapshotToCollection(doc)
  })

  return nullableArray2NonullableArray(collections)
}

type CollectionIdAndPurchaseDate = {
  collectionId: string
  purchasedAt: Date
}

export const getPurchasedCollections = async (
  userId: string
): Promise<PurchasedCollection[]> => {
  const purchasedSnapshot = await db
    .collection('purchased')
    .where('userId', '==', userId)
    .get()

  const purchaseInfos: CollectionIdAndPurchaseDate[] = purchasedSnapshot.docs.map(
    (doc): CollectionIdAndPurchaseDate => {
      const data = doc.data()
      return {
        collectionId: data.collectionId || '',
        purchasedAt: data.createdAt?.toDate() || new Date(),
      }
    }
  )

  const collections: PurchasedCollection[] = []
  for (const info of purchaseInfos) {
    if (!info.collectionId) {
      continue
    }
    const snapshot = await db
      .collection('collections')
      .doc(info.collectionId)
      .get()
    if (!snapshot.exists) {
      continue
    }

    const collection = snapshotToCollection(snapshot)
    if (!collection) {
      continue
    }
    collections.push({
      purchasedAt: info.purchasedAt,
      collection,
    })
  }

  return collections
}

export const getCollectionsByTag = async (
  tag: string
): Promise<Collection[]> => {
  const snapshot = await db
    .collection('collections')
    .where('tags', 'array-contains', tag)
    .get()

  const collections = snapshot.docs.map((doc) => {
    return snapshotToCollection(doc)
  })

  return nullableArray2NonullableArray(collections)
}

export const getCollectionsByUserId = async (
  userId: string
): Promise<Collection[]> => {
  const snapshot = await db
    .collection('collections')
    .where('creatorId', '==', userId)
    .get()

  const collections = snapshot.docs.map((doc) => {
    return snapshotToCollection(doc)
  })

  return nullableArray2NonullableArray(collections)
}

const snapshotToCollection = (
  snapshot: firebase.firestore.DocumentSnapshot
): Collection | null => {
  const data = snapshot.data()
  if (!data) {
    return null
  }
  return {
    id: snapshot.id,
    title: data.title || '',
    description: data.description || '',
    isPublic: data.isPublic || false,
    needPayment: data.needPayment || false,
    price: data.price || 100,
    creatorId: data.creatorId,
    tags: data.tags || [],
    imageUrl: data.imageUrl || '',
    quizCount: data.quizCount || 0,
    createdAt: data.createdAt?.toDate().toString() || new Date().toString(),
    updatedAt: data.updatedAt?.toDate().toString() || new Date().toString(),
  }
}
