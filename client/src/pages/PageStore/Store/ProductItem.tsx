import { Link } from 'react-router-dom'
import { useCartContext } from 'contexts'
import { Rating } from 'components/Rating'
import { formatCurrency } from 'utils'

export interface ProductItemProps {
  product: Product | null
}

const trash = (
  <svg width='1.25em' height='1.25em' fill='currentColor' viewBox='0 0 16 16'>
    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' />
    <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' />
  </svg>
)

/* ========================================================================
                                ProductItem
======================================================================== */

export const ProductItem = ({ product }: ProductItemProps) => {
  const { addOneToCart, removeOneFromCart, removeFromCart, cartItems } =
    useCartContext()
  const cartItem = product
    ? cartItems.find((item) => item.id === product._id)
    : null

  /* ======================
        renderButton()
  ====================== */

  const renderButton = () => {
    if (product === null) {
      return null
    }
    if (cartItem) {
      return (
        <div className='flex h-9 items-center justify-between rounded-none border-none bg-blue-500 px-2 text-base text-white'>
          <div className='flex min-w-[70px] items-center justify-between rounded-full bg-white text-sm text-blue-500'>
            <button
              className='px-2'
              onClick={() => removeOneFromCart(product._id)}
            >
              -
            </button>
            <span className='text-center font-bold'>{cartItem.quantity}</span>
            <button className='px-2' onClick={() => addOneToCart(product)}>
              +
            </button>
          </div>

          <button onClick={() => removeFromCart(product._id)}>{trash}</button>
        </div>
      )
    }

    return (
      <button
        onClick={() => addOneToCart(product)}
        className='btn-blue h-9 w-full rounded-none border-none active:scale-100'
      >
        Add To Cart
      </button>
    )
  }

  /* ======================
        renderProduct()
  ====================== */

  const renderProduct = () => {
    if (product === null) {
      return (
        <div className='relative flex flex-col overflow-hidden rounded-lg border border-neutral-300 bg-white shadow'>
          <div className='aspect-square p-2'>
            <div className='h-full w-full animate-pulse rounded-lg bg-neutral-200 [animation-duration:1000ms]' />
          </div>
          <div className='flex-1 px-2'>
            <div className='mb-2 h-5 w-3/4 animate-pulse rounded-lg bg-neutral-200 [animation-duration:1000ms]' />
            <div className='mb-2 h-5 w-8/12 animate-pulse rounded-lg bg-neutral-200 [animation-duration:1000ms]' />
            <div className='mb-2 h-6 w-12 animate-pulse rounded-lg bg-neutral-200 [animation-duration:1000ms]' />
          </div>
          <div className='flex h-9 animate-pulse bg-neutral-200  [animation-duration:1000ms]' />
        </div>
      )
    }

    return (
      <div className='relative flex flex-col overflow-hidden rounded-lg border border-blue-500 bg-white shadow'>
        <Link to={`/products/${product._id}`} className='aspect-square'>
          <img
            src={`${product.image}`}
            alt={product.name}
            className='block w-full object-contain'
          />
        </Link>

        {/* This container takes up remaining space with flex-1. 
        However, within this container we want the <h5> to occupy extra space. */}
        <div className='flex flex-1 flex-col px-2'>
          <h5 className='mb-0 flex-1'>
            <Link
              to={`/products/${product._id}`}
              className='text-left font-semibold hover:underline'
            >
              {product.name}
            </Link>
          </h5>

          <div className='flex flex-wrap items-center gap-4 '>
            <Rating
              className='!mb-1'
              defaultValue={product.rating}
              size='24px'
              spacing='4px'
              defaultColor='var(--tw-neutral-300)'
              activeColor='var(--tw-yellow-500)'
              readOnly={true}
              // precision={0.9}
              showTitle={true}
              // onChange={(newRating) => console.log('newRating', newRating)}
              // onHover={(hoveredRating) =>
              //   console.log('hoveredRating', hoveredRating)
              // }
            />

            <div className='text-sm font-medium text-neutral-500'>
              {Array.isArray(product.reviews) ? product.reviews.length : 0}{' '}
              Reviews
            </div>
          </div>

          <div className='mb-2 text-base font-bold text-green-500'>
            {formatCurrency(product.price)}
          </div>
        </div>

        {renderButton()}
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return renderProduct()
}
