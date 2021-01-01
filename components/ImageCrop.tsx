import {useState} from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function ImageCrop({setImageBlob}) {
  const [crop, setCrop] = useState({aspect: 1 / 1})
  const [src, setSrc] = useState(null)
  const [imageRef, setImageRef] = useState()

  function getCroppedImg(image, crop) {
    if (!image) {
      return
    }
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob)
        },
        'image/jpeg',
        1
      )
    })
  }

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setSrc(reader.result))
      reader.readAsDataURL(event.target.files[0])
      setImageBlob(event.target.files[0])
    }
  }

  const onImageLoaded = (image) => {
    setImageRef(image)
  }

  const onCropComplete = async (crop) => {
    const blob = await getCroppedImg(imageRef, crop)
    if (!blob) {
      return
    }
    setImageBlob(blob)
  }

  const onCropChange = (crop, percentCrop) => {
    setCrop(crop)
  }

  return (
    <div>
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      {src && (
        <div className="mt-2">
          <ReactCrop
            src={src}
            crop={crop}
            onChange={onCropChange}
            onImageLoaded={onImageLoaded}
            onComplete={onCropComplete}
          />
        </div>
      )}
    </div>
  )
}
