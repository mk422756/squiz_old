import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Button from 'components/Button'
import {usePaymentSecret} from 'hooks/user'
import {createPaymentMethod} from 'clients/payment'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import {useRecoilValue, useRecoilState} from 'recoil'
import {userState} from 'store/userState'
import {purchasedCollectionsInfoState} from 'store/purchasedCollectionsInfoState'
import PurchasingModal from 'components/purchase/PurchasingModal'

type CheckoutFormProps = {
  collectionId: string
  purchase: (paymentMethodId: string) => Promise<void>
}

type PaymentMethod = {
  id: string
  error: string | undefined
}

export default function CheckoutFormNewCard({
  collectionId,
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

  const secret = usePaymentSecret(user.id)
  const [error, setError] = useState('')
  const [purchasing, setPurchasing] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const {collection_id} = router.query
  const [isSaveCreditInfo, setIsSaveCreditInfo] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)

  const changeSaveCreditInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSaveCreditInfo(event?.target?.checked)
  }

  const saveCreditInfo = async (): Promise<PaymentMethod | null> => {
    if (!stripe || !elements) {
      return null
    }
    const card = elements.getElement(CardElement)
    if (!card) {
      return null
    }
    const {setupIntent, error} = await stripe.confirmCardSetup(
      secret.setupSecret,
      {
        payment_method: {
          card,
        },
      }
    )
    if (error) {
      return {id: '', error: error.message}
    }

    const paymentMethod = setupIntent?.payment_method
    if (!paymentMethod) {
      return null
    }

    await createPaymentMethod(paymentMethod)
    return {id: paymentMethod, error: ''}
  }

  const notSaveCreditInfo = async (): Promise<PaymentMethod | null> => {
    if (!stripe || !elements) {
      return null
    }

    const card = elements.getElement(CardElement)
    if (!card) {
      return null
    }
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    })

    if (!paymentMethod) {
      return null
    }

    if (error) {
      return {id: '', error: error.message}
    }

    return {id: paymentMethod.id, error: ''}
  }

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
      let paymentMethod = null
      if (isSaveCreditInfo) {
        paymentMethod = await saveCreditInfo()
      } else {
        paymentMethod = await notSaveCreditInfo()
      }

      if (!paymentMethod) {
        setPurchasing(false)
        return
      }

      if (paymentMethod.error) {
        setError(paymentMethod.error)
        setPurchasing(false)
        return
      }
      setError('')

      await purchase(paymentMethod.id)

      alert('購入が完了しました')
      router.push(`/collections/${collectionId}`)
    } catch (e) {
      console.log(e)
      alert('購入処理に失敗しました')
      setPurchasing(false)
    }
  }

  const onChangeCardInput = (event: any) => {
    setCanSubmit(event.complete)
  }

  return (
    <form>
      <p className="text-lg font-semibold">カード情報を入力してください</p>
      <div className="py-4">
        <CardElement
          onChange={onChangeCardInput}
          className="border bg-white p-4 rounded"
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '18px',
              },
            },
          }}
        />
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <div className="mt-2">
          <label>
            <input
              type="checkbox"
              onChange={changeSaveCreditInfo}
              checked={isSaveCreditInfo}
            />
            <span className="text-gray-400">カード情報をStripeに保存する</span>
          </label>
        </div>
      </div>
      <div className="mt-10">
        <PurchasingModal isOpen={purchasing}></PurchasingModal>

        <div>
          <Button
            onClick={handleSubmit}
            disabled={!stripe || !canSubmit || purchasing}
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
    </form>
  )
}
