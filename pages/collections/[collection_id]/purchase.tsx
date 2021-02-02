import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {getUser, getPurchasedCollectionIds} from 'clients/user'
import Button from 'components/Button'
import {useCollection} from 'hooks/collection'
import {useUser, usePaymentSecret} from 'hooks/user'
import {createPayment, createPaymentMethod} from 'clients/payment'
import {loadStripe} from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import {useRecoilValue, useRecoilState} from 'recoil'
import {userState} from 'store/userState'
import {purchasedCollectionsInfoState} from 'store/purchasedCollectionsInfoState'

type CheckoutFormProps = {
  collectionId: string
  amount: number
}

type PaymentMethod = {
  id: string
  error: string | undefined
}

const CheckoutForm = ({collectionId, amount}: CheckoutFormProps) => {
  const [
    purchasedCollectionsInfo,
    setPurchasedCollectionsInfo,
  ] = useRecoilState(purchasedCollectionsInfoState)
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

  const updatePurchasedCollectionsInfoState = async () => {
    const infos = await getPurchasedCollectionIds(user.id)
    setPurchasedCollectionsInfo(infos)
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    try {
      if (!user.id) {
        alert('ユーザー情報が不正です')
        return
      }

      if (alreadyPurchased) {
        alert('既に購入済みです')
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
        return
      }

      if (paymentMethod.error) {
        setError(paymentMethod.error)
        setPurchasing(false)
        return
      }
      setError('')

      if (!confirm('購入しますがよろしいですか？')) {
        setPurchasing(false)
        return
      }

      const data = {
        payment_method: paymentMethod.id,
        currency: 'jpy',
        amount: amount,
        status: 'new',
        collection_id: collectionId,
      }

      await createPayment(data)
      await updatePurchasedCollectionsInfoState()
      alert('購入が完了しました')
      router.push(`/collections/${collectionId}`)
    } catch (e) {
      console.log(e)
      alert('購入処理に失敗しました')
      setPurchasing(false)
    }
  }

  return (
    <form>
      <CardElement
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
      <div className="mt-10">
        <div>
          <Button
            onClick={handleSubmit}
            disabled={!stripe || purchasing}
            fullWidth={true}
            loading={purchasing}
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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ''
)

export default function PurchasePage() {
  const router = useRouter()
  const {collection_id} = router.query
  const collection = useCollection(collection_id as string)
  const creator = useUser(collection?.creatorId)

  return (
    <Layout>
      <main>
        <div className="p-4 bg-white">
          <h1 className="pt-4 text-2xl font-semibold break-words">
            {collection.title}
          </h1>

          <div className="pt-2">
            <Link href={`/users/${creator.id}`}>
              <a>
                <img
                  className="inline-block h-6 w-6 rounded-full bg-white"
                  src={creator.imageUrl ? creator.imageUrl : '/user_avatar.png'}
                />
                <span className="ml-1 text-sm font-semibold">
                  {creator.name}
                </span>
              </a>
            </Link>
          </div>

          <div className="mt-8 text-3xl font-semibold">
            <span>支払額: {collection.price}円</span>
          </div>
          <div className="mt-8 text-gray-400 text-sm ">
            クレジットカード決済は、
            <a className="text-primary" href="https://stripe.com/jp">
              Stripe
            </a>
            を利用しています。 <br></br>
            クレジットカード情報は当サービスでは保持せず、決済代行会社であるStripe社で安全に管理されます。
          </div>
          <div className="mt-8">
            <p className="text-lg">カード情報を入力</p>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                collectionId={collection_id as string}
                amount={collection.price}
              />
            </Elements>
          </div>
        </div>
      </main>
    </Layout>
  )
}
