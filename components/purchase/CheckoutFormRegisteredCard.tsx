import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Button from 'components/Button'
import {useRecoilValue, useRecoilState} from 'recoil'
import {userState} from 'store/userState'
import {purchasedCollectionsInfoState} from 'store/purchasedCollectionsInfoState'
import PurchasingModal from 'components/purchase/PurchasingModal'
import {PaymentMethod} from 'models/paymentMethod'

type CheckoutFormProps = {
  collectionId: string
  paymentMethods: PaymentMethod[]
  purchase: (paymentMethodId: string) => Promise<void>
}

export default function CheckoutFormNewCard({
  collectionId,
  paymentMethods,
  purchase,
}: CheckoutFormProps) {
  const [purchasedCollectionsInfo] = useRecoilState(
    purchasedCollectionsInfoState
  )
  const alreadyPurchased = !!purchasedCollectionsInfo.find(
    (info) => info.collectionId === collectionId
  )
  const user = useRecoilValue(userState)
  if (!user) {
    return <div>now loading</div>
  }

  const [purchasing, setPurchasing] = useState(false)
  const router = useRouter()
  const {collection_id} = router.query
  const [paymentId, setPaymentId] = useState('')

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    try {
      if (!user.id) {
        alert('エラーが発生しました')
        return
      }

      if (alreadyPurchased) {
        alert('既に購入済みです')
        return
      }
      if (!confirm('購入しますがよろしいですか？')) {
        return
      }

      setPurchasing(true)

      await purchase(paymentId)

      alert('購入が完了しました')
      router.push(`/collections/${collectionId}`)
    } catch (e) {
      console.log(e)
      alert('購入処理に失敗しました')
      setPurchasing(false)
    }
  }

  const onChangeRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentId(e.target.value)
  }

  return (
    <div>
      <p className="text-lg font-semibold">カード選択してください</p>
      {paymentMethods.map((method) => {
        return (
          <label key={method.id} className="mt-1 p-4 border rounded block">
            <input
              type="radio"
              name="card"
              value={method.paymentMethodId}
              onChange={onChangeRadio}
            ></input>
            <span className="ml-2">**** **** **** {method.last4}</span>
          </label>
        )
      })}

      <PurchasingModal isOpen={purchasing}></PurchasingModal>
      <div className="mt-8">
        <Button
          onClick={handleSubmit}
          disabled={!paymentId || purchasing}
          fullWidth={true}
        >
          購入
        </Button>
      </div>

      <div className="mt-4">
        <Button fullWidth={true} color="gray" disabled={purchasing}>
          <Link href={`/collections/${collection_id}`}>
            <a>キャンセル</a>
          </Link>
        </Button>
      </div>
    </div>
  )
}
