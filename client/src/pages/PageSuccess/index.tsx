import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

// Custom imports
import { useTitle } from 'hooks'
import { HR, Waves } from 'components'
import { useThemeContext, useCartContext } from 'contexts'
import { updateOrderPaymentStatus } from 'clientAPI/updateOrderPaymentStatus'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

/* ========================================================================

======================================================================== */
// See here at 2:19:15 where he also returns the session_id as a
// query param: https://www.youtube.com/watch?v=p_q8gy_jmP8
// Here we are able to retrieve our checkout session from stripe.
// Actually he implements the usage of the session_id at 2:37:00
// However, exposing the sessionId could be a security risk.
// Instead use the orderId.

const PageSuccess = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { clearCart, setCurrentOrder } = useCartContext()

  useTitle('Success')
  const { mode } = useThemeContext()

  /* ======================
        useEffect()
  ====================== */
  // On mount, use the orderId to update the payment status.

  useEffect(() => {
    if (!orderId || typeof orderId !== 'string') {
      return
    }

    //# Rename specifically to updateOrderToPaid()
    updateOrderPaymentStatus(orderId)
      .then((result: any) => {
        const { message, success } = result

        if (success === true) {
          // This allows the user to create a new order.
          setCurrentOrder('')
          clearCart()
        } else if (message && typeof message === 'string') {
          toast.error(message) // e.g., "The order has already been paid."
        }

        return result
      })

      // This will never happen since the client API function catches errors internally.
      .catch((_err) => {
        toast.error('The request failed.')
      })
  }, [orderId, clearCart, setCurrentOrder])

  /* ======================
          return
  ====================== */

  return (
    <div
      className={`
      mx-auto flex w-full flex-1 flex-wrap`}
      style={{
        backgroundImage: mode === 'dark' ? darkBackgroundImage : backgroundImage
      }}
    >
      <Waves />

      <div
        className='relative mx-auto w-full flex-1 p-6 2xl:container'
        style={{ minHeight: '200vh' }}
      >
        <h1
          className='text-center text-5xl font-black'
          style={{ position: 'relative', marginBottom: 24 }}
        >
          <span
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textShadow:
                '0px 0px 1px rgba(0,0,0,1), 0px 0px 1px rgba(0,0,0,1)',
              width: '100%',
              height: '100%'
            }}
          >
            Success
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Success
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        <p className='text-center text-2xl font-bold text-violet-800'>
          Thank you for your purchase!
        </p>
      </div>
    </div>
  )
}

export default PageSuccess
