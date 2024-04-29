import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

// Custom imports
import { sleep } from 'utils'
import { useTitle } from 'hooks'
import { useThemeContext, useAuthContext, useCartContext } from 'contexts'
import { Alert, Button, HR } from 'components'
import { payOrder } from './payOrder'
import { getOrder } from './getOrder'
import { OrderInfo, OrderTable } from './components'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

/* ========================================================================
                                  PageOrder 
======================================================================== */

const PageOrder = () => {
  const navigate = useNavigate()
  const { id: orderId } = useParams()

  useTitle('Order')
  const { authData } = useAuthContext()
  const { setCurrentOrder, setCartItems } = useCartContext()
  const { mode } = useThemeContext()

  /* ======================
       state & refs
  ====================== */

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  const [order, setOrder] = useState<Order | null>(null)

  /* ======================
  handleContinueShopping()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // PageOrder has two different flows when a user decides to continue shopping.
  //
  //   If user is logged in:
  //   - Set currentOrder to the orderId of this order.
  //   - Set cartItems to newCartItems derived from orderItems for this order.
  //   - Navigate to '/store'.
  //
  //   If user is guest:
  //   - Delete order from database.
  //   - Navigate to '/store'.
  //
  // Why is a guest user handled differently? Setting currentOrder in CartContext
  // and localStorage has the effect of loading that order into memory. When the
  // user hits the PageCheckout currentOrder will be checked. If currentOrder
  // exists, then an API call will be made to get checkoutData from that order.
  //
  // The last thing we want is to leave the currentOrder in memory because this
  // could potentially expose private and/or sensitive data if a random person
  // comes along and steps through the checkout process, only to see some other
  // users data loaded in the page. This is why the 'use current order' feature
  // is reserved only for authenticated users. When a user is authenticated, we
  // know it's safe to implement currentOrder, and we know that when the user logs
  // out we can remove currentOrder from localStorage and memory.
  //
  // Obviously, localStorage is still susceptible to XSS attacks. However,
  // the API call to get the current order is protected, so even if someone hacked
  // localStorage and got an order id, they wouldn't actually be able to access any
  // data from that order.
  //
  ///////////////////////////////////////////////////////////////////////////

  const handleContinueShopping = () => {
    if (
      authData &&
      orderId &&
      typeof orderId === 'string' &&
      order &&
      Array.isArray(order?.orderItems)
    ) {
      // The "Continue Shopping" button should only be rendered
      // when !isPaid, but having a check here is also useful.
      if (order?.isPaid !== true) {
        const newCartItems = order.orderItems.map((item: any) => {
          const newCartItem: CartItem = {
            id: item?.product,
            quantity: item?.quantity
          }
          return newCartItem
        })

        setCartItems(newCartItems)
        setCurrentOrder(orderId)
        navigate('/store')
      }
    } else {
      //# Delete order. For this we could create deleteOrder() on the client/server.
      // In theory, it's relatively safe to delete an order
      // as long as it hasn't been paid for. That said, even having a deleteOrder()
      // controller feels dangerous. Another approach could be to have a CRON job
      // that removes abandoned orders after a month. This CRON job would also
      // check that there was NOT an associated user. Why? Because if the order
      // has a user, then the user is entirely capbable of removing the order themselves.
      navigate('/store')
    }
  }

  /* ======================
      handlePayOrder()
  ====================== */

  const handlePayOrder = () => {
    if (!orderId) {
      return
    }

    payOrder(orderId)
      .then((json) => {
        const { success, data } = json
        // Forward user to stripe: https://checkout.stripe.com/c/pay/cs_test_...
        if (success === true && typeof data === 'string') {
          window.location.assign(data)
        } else {
          toast.error('Unable to proceed to payment.')
        }

        return json
      })
      // Will never happen because it's caught previously.
      .catch((err) => {
        toast.error('Unable to proceed to payment.')
        return err
      })
  }

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (!orderId || typeof orderId !== 'string') {
      return
    }

    setStatus('pending')

    getOrder(orderId)
      .then(async (json) => {
        await sleep(1500)

        const { success, data } = json
        if (success === true && data && typeof data === 'object') {
          setStatus('success')
          setOrder(data)
        } else {
          setStatus('error')
        }

        return json
      })
      .catch((err) => {
        setStatus('error')
        return err
      })
  }, [orderId])

  /* ======================
      renderContent()
  ====================== */

  const renderContent = () => {
    if (status === 'error') {
      return (
        <Alert
          className='alert-red mx-auto my-12 max-w-2xl'
          leftSection={
            <svg
              style={{ height: '3em' }}
              fill='currentColor'
              viewBox='0 0 16 16'
            >
              <path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z' />
              <path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z' />
            </svg>
          }
          rightSection={
            <button
              className={`${Alert.redButtonFix} flex w-full active:scale-[0.99]`}
              onClick={() => {
                if (!orderId || typeof orderId !== 'string') {
                  return
                }

                setStatus('pending')

                getOrder(orderId)
                  .then(async (json) => {
                    await sleep(1500)

                    const { success, data } = json
                    if (success === true && data && typeof data === 'object') {
                      setStatus('success')
                      setOrder(data)
                    } else {
                      setStatus('error')
                    }

                    return json
                  })
                  .catch((err) => {
                    setStatus('error')
                    return err
                  })
              }}
              style={{ minWidth: 100 }}
            >
              Retry
            </button>
          }
          rightClassName='items-end flex'
          centerClassName='flex-1'
        >
          <Alert.Heading>Error!</Alert.Heading>

          <p className='text-sm'>Unable to get order.</p>
        </Alert>
      )
    }

    return (
      <>
        <OrderInfo order={order} status={status} />
        <OrderTable order={order} status={status} />

        {/* Only show the "Proceed To Payment" and "Continue Shopping" button if order.isPaid !== true. */}
        {order && order?.isPaid !== true && (
          <div className='flex flex-wrap justify-center gap-4'>
            <Button
              className='btn-blue btn-sm'
              onClick={handleContinueShopping}
            >
              Continue Shopping For This Order
            </Button>

            <Button className='btn-blue btn-sm' onClick={handlePayOrder}>
              Proceed To Payment
            </Button>
          </div>
        )}
      </>
    )
  }

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
      <div className='relative mx-auto w-full flex-1 p-6 2xl:container'>
        <h1
          className='text-center text-5xl font-black'
          style={{ position: 'relative' }}
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
            Order
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Order
          </span>
        </h1>

        {orderId && (
          <h5 className='mb-6 text-center font-black text-blue-500'>
            {orderId}
          </h5>
        )}

        <HR style={{ marginBottom: 50 }} />

        {renderContent()}
      </div>

      <Button
        className='btn-blue btn-sm absolute left-4 top-4'
        onClick={() => {
          navigate(-1)
        }}
      >
        <svg
          width='2em'
          height='2em'
          fill='currentColor'
          viewBox='0 0 16 16'
          style={{ margin: '-10px -5px' }}
        >
          <path
            fillRule='evenodd'
            d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5'
          />
        </svg>
        Back
      </Button>
    </div>
  )
}

export default PageOrder
