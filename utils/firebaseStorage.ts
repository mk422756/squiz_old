import firebase from '../lib/firebase'

const storage = firebase.storage()

export async function putFile(filePath: string, blobFile: Blob) {
  const storageRef = storage.ref()
  const imagesRef = storageRef.child(filePath)
  await imagesRef.put(blobFile)
  return await imagesRef.getDownloadURL()
}
