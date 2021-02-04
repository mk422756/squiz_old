import {useState} from 'react'
import {useRouter} from 'next/router'
import Layout from 'layouts/layout'
import {getPurchasedCollectionIds} from 'clients/user'
import {usePaymentMethods} from 'hooks/paymentMethod'
import {useCollection} from 'hooks/collection'
import {createPayment} from 'clients/payment'
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import {useRecoilValue, useRecoilState} from 'recoil'
import {userState} from 'store/userState'
import {purchasedCollectionsInfoState} from 'store/purchasedCollectionsInfoState'
import CheckoutFormNewCard from 'components/purchase/CheckoutFormNewCard'
import CheckoutFormRegisteredCard from 'components/purchase/CheckoutFormRegisteredCard'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ''
)

enum Payment {
  NEW = 'new',
  REGISTERED = 'registered',
}

export default function PurchasePage() {
  const user = useRecoilValue(userState)
  if (!user) {
    return <div>now loading</div>
  }
  const [
    purchasedCollectionsInfo,
    setPurchasedCollectionsInfo,
  ] = useRecoilState(purchasedCollectionsInfoState)
  const router = useRouter()
  const {collection_id} = router.query
  const collection = useCollection(collection_id as string)
  if (!collection) {
    return <div>now loading</div>
  }
  const paymentMethods = usePaymentMethods(user.id)

  const [payment, setPayment] = useState<string>(Payment.REGISTERED)
  const changePayment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayment(e.target.value)
  }

  const updatePurchasedCollectionsInfoState = async () => {
    const infos = await getPurchasedCollectionIds(user.id)
    setPurchasedCollectionsInfo(infos)
  }

  const purchase = async (paymentMethodId: string) => {
    const data = {
      payment_method: paymentMethodId,
      currency: 'jpy',
      amount: collection.price,
      status: 'new',
      collection_id: collection.id,
    }

    await createPayment(data)
    await updatePurchasedCollectionsInfoState()
  }

  return (
    <Layout>
      <main>
        <div className="p-4 bg-white">
          <h1 className="pt-4 text-2xl font-semibold break-words">
            {collection.title}
          </h1>

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
            <div>
              <label>
                <input
                  type="radio"
                  name="methods"
                  value={Payment.REGISTERED}
                  checked={payment === Payment.REGISTERED}
                  onChange={changePayment}
                ></input>
                登録したカードで支払う
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="methods"
                  value={Payment.NEW}
                  checked={payment === Payment.NEW}
                  onChange={changePayment}
                ></input>
                新しいカードで支払う
              </label>
            </div>
            <div className="mt-8">
              {payment === Payment.REGISTERED && (
                <CheckoutFormRegisteredCard
                  collectionId={collection_id as string}
                  paymentMethods={paymentMethods}
                  purchase={purchase}
                ></CheckoutFormRegisteredCard>
              )}
              {payment === Payment.NEW && (
                <div>
                  <Elements stripe={stripePromise}>
                    <CheckoutFormNewCard
                      collectionId={collection_id as string}
                      purchase={purchase}
                    />
                  </Elements>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
