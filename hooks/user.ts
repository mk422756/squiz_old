import {useState, useEffect} from 'react'
import {User} from 'models/user'
import {PaymentSecret} from 'models/paymentSecret'
import {getUser, getPaymentSecret} from 'clients/user'

export function useUser(id: string) {
  const [user, setUser] = useState<User>({
    id: '',
    description: '',
    name: '',
    facebookId: '',
    twitterId: '',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const user = await getUser(id)
      if (!unmounted && user) {
        setUser(user)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [id])

  return user
}

export function usePaymentSecret(userId: string) {
  const [secret, setSecret] = useState<PaymentSecret>({
    setupSecret: '',
    customerId: '',
  })

  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const secret = await getPaymentSecret(userId)
      if (!unmounted) {
        setSecret(secret)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [userId])

  return secret
}
