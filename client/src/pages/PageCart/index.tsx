import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Custom imports
import { sleep } from 'utils'
import { useTitle } from 'hooks'
import { Alert, Button, HR, Waves } from 'components'
import { useThemeContext } from 'contexts'
import { CartTable } from './CartTable'
import { useCartContext, useAuthContext } from 'contexts'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

/* ========================================================================

======================================================================== */

const PageCart = () => {
  const navigate = useNavigate()
  useTitle('Cart')
  const { mode } = useThemeContext()
  const { authData } = useAuthContext()
  const { cartItems, clearCart, getCartProducts } = useCartContext()

  const firstRenderRef = useRef(true)

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  const [cartProducts, setCartProducts] = useState<Product[] | null>(null)

  /* ======================
        useEffect()
  ====================== */
  // On mount only, get the full product data for each item in cartItems.

  useEffect(() => {
    // Prevent additional calls to '/api/products/cart' that would
    // otherwise fire when quantity changes.
    if (firstRenderRef.current === false) {
      return
    }
    firstRenderRef.current = false

    // Return early if cartItems is empty.
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      setCartProducts([])
      setStatus('success')
      return
    }

    setStatus('pending')
    const productIds = cartItems.map((item) => item.id)
    getCartProducts(productIds)
      .then(async (json) => {
        await sleep(1500)

        const { success, data: newCartProducts } = json

        if (success === true && Array.isArray(newCartProducts)) {
          setCartProducts(newCartProducts)
          setStatus('success')
        } else {
          setStatus('error')
        }
        return json
      })

      .catch((err) => {
        setStatus('error')
        return err
      })
  }, [cartItems, getCartProducts])

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
                setStatus('pending')
                const productIds = cartItems.map((item) => item.id)
                getCartProducts(productIds)
                  .then(async (json) => {
                    await sleep(1500)
                    const { success, data: newCartProducts } = json

                    if (success === true && Array.isArray(newCartProducts)) {
                      setCartProducts(newCartProducts)
                      setStatus('success')
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

          <p className='text-sm'>Unable to get data for cart products.</p>
        </Alert>
      )
    }

    // Because nothing else is shown on the page, we can get away with position:fixed and centering.
    // Spinner taken from https://nextui.org landing page.
    if (status === 'pending') {
      return (
        <div
          aria-label='Loading'
          className='pointer-events-none fixed inset-0 flex items-center justify-center'
        >
          <div className='relative flex h-20 w-20'>
            <i className='absolute h-full w-full animate-[store-spinner-spin_0.8s_ease_infinite] rounded-full border-[6px] border-solid border-b-violet-800 border-l-transparent border-r-transparent border-t-transparent'></i>
            <i className='absolute h-full w-full animate-[store-spinner-spin_0.8s_linear_infinite] rounded-full border-[6px] border-dotted border-b-violet-800 border-l-transparent border-r-transparent border-t-transparent opacity-75'></i>
          </div>
        </div>
      )
    }

    if (status === 'success' && Array.isArray(cartProducts)) {
      if (cartItems.length === 0 || cartProducts.length === 0) {
        return (
          <Alert
            className='alert-blue mx-auto my-12 max-w-2xl'
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
                className={`btn-blue btn-sm flex w-full active:scale-[0.99]`}
                onClick={() => {
                  navigate('/store')
                }}
                style={{ minWidth: 100 }}
              >
                Go To Store
              </button>
            }
            rightClassName='items-end flex'
            centerClassName='flex-1'
          >
            <Alert.Heading>Whoops!</Alert.Heading>

            <p className='text-sm'>There are no items in your cart.</p>
          </Alert>
        )
      }

      return (
        <>
          <CartTable cartProducts={cartProducts} />

          <div className='flex flex-wrap justify-end gap-4'>
            <Button
              className='btn-blue btn-sm'
              onClick={() => {
                clearCart()
                setCartProducts([])
              }}
              style={{ minWidth: 150 }}
            >
              Remove All Items
            </Button>

            <Button
              className='btn-blue btn-sm'
              onClick={() => {
                navigate(-1)
              }}
              style={{ minWidth: 150 }}
            >
              Continue Shopping
            </Button>

            {authData ? (
              <Button
                className='btn-blue btn-sm'
                onClick={() => {
                  navigate('/checkout')
                }}
                style={{ minWidth: 150 }}
              >
                Proceed To Checkout
              </Button>
            ) : (
              <Button
                className='btn-blue btn-sm'
                onClick={() => {
                  navigate('/checkout')
                }}
                style={{ minWidth: 150 }}
              >
                Proceed To Guest Checkout
              </Button>
            )}
          </div>
        </>
      )
    }
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
      <Waves />

      <div className='relative mx-auto w-full flex-1 p-6 2xl:container'>
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
            Cart
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Cart
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        {renderContent()}
      </div>
    </div>
  )
}

export default PageCart
