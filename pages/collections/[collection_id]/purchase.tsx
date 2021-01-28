import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {getUser} from 'clients/user'
import Button from 'components/Button'
import {useCollection} from 'hooks/collection'
import {createPayment} from 'clients/payment'
import {loadStripe} from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import {useRecoilValue} from 'recoil'
import {userState} from 'store/userState'
import {purchasedCollectionsInfoState} from 'store/purchasedCollectionsInfoState'

type CheckoutFormProps = {
  collectionId: string
  amount: number
}

const CheckoutForm = ({collectionId, amount}: CheckoutFormProps) => {
  const purchasedCollectionsInfo = useRecoilValue(purchasedCollectionsInfoState)
  const alreadyPurchased = !!purchasedCollectionsInfo.find(
    (info) => info.collectionId === collectionId
  )
  const user = useRecoilValue(userState)
  const [error, setError] = useState('')
  const [purchasing, setPurchasing] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const handleSubmit = async (event) => {
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
      const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      })

      console.log(error)

      if (error) {
        setError(error.message)
        setPurchasing(false)
        return
      } else {
        // TODO 支払い方法の保存
        // const {setupIntent, error} = await stripe.confirmCardSetup(
        //   'seti_xxxxxxxxxxxxxxx_secret_xxxxxxxxxxxxxxx',
        //   {
        //     payment_method: {
        //       card: elements.getElement(CardElement),
        //     },
        //   }
        // )
        setError('')
      }

      if (!confirm('購入しますがよろしいですか？')) {
        return
      }

      const data = {
        payment_method: paymentMethod.id,
        currency: 'jpy',
        amount: amount,
        status: 'new',
        collection_id: collectionId,
      }

      await createPayment(user.id, data)
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
      <div className="mt-4">
        <Button
          onClick={handleSubmit}
          disabled={!stripe || purchasing}
          fullWidth={true}
        >
          Pay
        </Button>
      </div>
    </form>
  )
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function PurchasePage() {
  const router = useRouter()
  const {collection_id} = router.query
  const collection = useCollection(collection_id as string)
  const [creator, setCreator] = useState({} as any)

  // TODO 購入ユーザーと作者を区別する

  useEffect(() => {
    let unmounted = false
    ;(async () => {
      if (!unmounted) {
        if (!collection?.creatorId) {
          return
        }
        const user = await getUser(collection.creatorId)
        if (!unmounted) {
          setCreator(user)
        }
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collection])

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

          <div className="mt-4 text-2xl font-semibold">
            <span>支払額: {collection.price}円</span>
          </div>
          <div className="mt-4">
            <p>カード情報を入力</p>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                collectionId={collection_id as string}
                amount={collection.price}
              />
            </Elements>
            <div className="mt-4">
              <Button fullWidth={true} color="gray">
                <Link href={`/collections/${collection_id}`}>
                  <a>キャンセル</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
