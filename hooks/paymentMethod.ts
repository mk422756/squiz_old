import {useState, useEffect} from 'react'
import {getPaymentMethods} from 'clients/payment'
import {PaymentMethod} from 'models/paymentMethod'

export function usePaymentMethods(userId: string) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const paymentMethods = await getPaymentMethods(userId)
      if (!unmounted) {
        setPaymentMethods(paymentMethods)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [userId])

  return paymentMethods
}
