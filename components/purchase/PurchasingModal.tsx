import ReactModal from 'react-modal'
import ReactLoading from 'react-loading'

type Props = {
  isOpen: boolean
}

export default function PurchasingModal({isOpen}: Props) {
  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      bottom: 'auto',
      right: '10%',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  }
  return (
    <ReactModal
      isOpen={isOpen}
      style={customModalStyles}
      contentLabel="購入処理中"
    >
      <div className="mt-4">
        <ReactLoading
          type="spin"
          color="#63B9ED"
          height={70}
          width={70}
          className="mx-auto"
        />
      </div>
      <div className="w-full mt-8 text-center">
        <h2 className="text-2xl font-semibold">購入処理中です</h2>
        <p className="mt-4">
          処理中はブラウザの戻るボタンや閉じる処理を使用しないでください
        </p>
      </div>
    </ReactModal>
  )
}
