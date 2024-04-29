import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useCartContext } from 'contexts'
import { useTitle } from 'hooks'
import { Alert, Button, HR } from 'components'
import { Rating } from 'components/Rating'
import { useThemeContext, useAuthContext } from 'contexts'
import { getProduct } from 'clientAPI'
import { sleep, formatCurrency } from 'utils'

import { CreateProductReviewForm, Reviews } from './components'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

const trash = (
  <svg width='1.25em' height='1.25em' fill='currentColor' viewBox='0 0 16 16'>
    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' />
    <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' />
  </svg>
)

/* ========================================================================
                            PageProduct 
======================================================================== */
//# Should also have a section that shows reviews, or at least a limited number of
//# reviews. Then link to a page that shows all reviews.

const PageProduct = () => {
  const navigate = useNavigate()
  const { authData } = useAuthContext()
  const { mode } = useThemeContext()

  const { id: productId = '' } = useParams()
  useTitle('Product')

  const { addOneToCart, removeOneFromCart, removeFromCart, cartItems } =
    useCartContext()

  const [product, setProduct] = useState<Product | null>(null)

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  // Using the productId, check to see if there is a matching cartItem.
  const cartItem = product
    ? cartItems.find((item) => item.id === productId)
    : null

  const quantitySelectedOfCurrentProduct = (() => {
    let qty = 0
    // const cartItem = cartItems.find((item) => item.id === productId)
    if (cartItem) {
      qty = cartItem.quantity
    }
    return qty
  })()

  const stock = typeof product?.stock === 'number' ? product.stock : 0
  const isInStock = stock > 0

  const stockExhausted = (() => {
    if (!isInStock) {
      return true
    }

    if (quantitySelectedOfCurrentProduct >= stock) {
      return true
    }

    return false
  })()

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    setStatus('pending')

    getProduct(productId)
      .then(async (json) => {
        await sleep(1500)
        const { data, success } = json

        if (success === true && data && typeof data === 'object') {
          setProduct(data)
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
  }, [productId])

  /* ======================
        renderButtons()
  ====================== */

  const renderButtons = () => {
    if (product === null) {
      return null
    }

    if (cartItem) {
      return (
        <div className='flex gap-4'>
          <div className='btn-group w-full' role='group'>
            <Button
              className='btn-blue active:scale-100'
              title='Remove One From Cart'
              onClick={() => removeOneFromCart(productId)}
            >
              -
            </Button>

            <span className='btn-blue active:scale-100'>
              {cartItem.quantity}
            </span>

            <Button
              className='btn-blue active:scale-100'
              // If we remove the conditional disabled, addOneToCart()
              // Also performs its own check such that it will not allow
              // more of that item to be added to the cart than exists in stock.
              disabled={stockExhausted}
              title='Add One To Cart'
              onClick={() => addOneToCart(product)}
            >
              +
            </Button>
          </div>

          <button
            className='btn-red w-full active:scale-100'
            onClick={() => removeFromCart(product._id)}
            title='Remove All From Cart'
          >
            {trash} Remove All
          </button>
        </div>
      )
    }

    return (
      <Button
        className='btn-blue w-full active:scale-100'
        disabled={!isInStock}
        onClick={() => addOneToCart(product)}
      >
        {isInStock ? 'Add To Cart' : 'Out Of Stock'}
      </Button>
    )
  }

  /* ======================
      renderProduct()
  ====================== */

  const renderProduct = () => {
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
                if (!productId || typeof productId !== 'string') {
                  return
                }

                setStatus('pending')

                getProduct(productId)
                  .then(async (json) => {
                    await sleep(1500)
                    const { data, success } = json

                    if (success === true && data && typeof data === 'object') {
                      setProduct(data)
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

          <p className='text-sm'>Unable to get product.</p>
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

    if (status === 'success' && product && typeof product === 'object') {
      return (
        <>
          <section className='mb-6 flex flex-col gap-6 lg:flex-row'>
            <div className='flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-white'>
              <img
                className='block w-full object-contain'
                src={`${product.image}`}
                alt={product.name}
              />
            </div>

            <div className='flex flex-1 flex-col rounded-xl border border-neutral-800 bg-white p-4 text-base lg:flex-[2_2_0%]'>
              <h3 className='font-black text-blue-500'>{product.name}</h3>

              <div className='flex justify-between'>
                <span className='font-bold text-blue-500'>Category:</span>{' '}
                {product.category}
              </div>

              <div className='flex justify-between'>
                <span className='font-bold text-blue-500'>Price:</span>

                <span className='font-mono'>
                  {formatCurrency(product.price)}
                </span>
              </div>

              <div className='flex justify-between'>
                <span className='font-bold text-blue-500'>Brand:</span>{' '}
                {product.brand}
              </div>

              <div className='flex justify-between'>
                <span className='font-bold text-blue-500'>Status:</span>{' '}
                {isInStock ? (
                  <span className='font-bold text-green-500'>In Stock</span>
                ) : (
                  <span className='font-bold text-red-500'>Out Of Stock</span>
                )}
              </div>

              <div className='flex justify-between'>
                <span className='font-bold text-blue-500'>Rating:</span>{' '}
                <div className='inline-flex items-center gap-1'>
                  <Rating
                    defaultValue={product.rating}
                    size='20px'
                    spacing='0px'
                    defaultColor='var(--tw-neutral-300)'
                    activeColor='var(--tw-yellow-500)'
                    readOnly={true}
                    showTitle={true}
                  />{' '}
                  <div className='mt-0.5 text-sm text-blue-500'>
                    <span className='font-bold'>{product.rating}</span>{' '}
                    <span className=''>({product.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className='my-4 flex-1'>
                <p>{product.description}</p>
              </div>

              {renderButtons()}
            </div>
          </section>

          <section className='mb-6 flex flex-col gap-6 lg:flex-row'>
            {product && <Reviews reviews={product.reviews} />}

            {authData && (
              <CreateProductReviewForm
                productId={productId}
                onSuccess={() => {
                  getProduct(productId)
                    .then((result) => {
                      const { data, success } = result

                      if (
                        success === true &&
                        data &&
                        typeof data === 'object'
                      ) {
                        setProduct(data)
                      }
                      return result
                    })
                    .catch((err) => {
                      return err
                    })
                }}
              />
            )}
          </section>
        </>
      )
    }

    // Fallback...
    return null
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
            Product
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Product
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        {renderProduct()}
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

export default PageProduct
