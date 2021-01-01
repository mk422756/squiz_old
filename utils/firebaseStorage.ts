import firebase from '../lib/firebase'

const storage = firebase.storage()

export async function putFile(filePath: string, blobFile: Blob) {
  var storageRef = storage.ref()

  // Create a reference to 'images/mountains.jpg'
  var imagesRef = storageRef.child(filePath)

  const [, url] = await Promise.all([
    imagesRef.put(blobFile),
    imagesRef.getDownloadURL(),
  ])

  return url
  // await imagesRef.put(blobFile)
  // const test = await imagesRef.getDownloadURL()
}
