import {useState, useEffect} from 'react'
import {PaymentSecret} from 'models/paymentSecret'
import {getPaymentSecret} from 'clients/user'

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
