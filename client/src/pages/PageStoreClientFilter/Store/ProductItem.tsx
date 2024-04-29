import { Link } from 'react-router-dom'
import { useCartContext } from 'contexts'
import { Rating } from 'components/Rating'

export interface ProductItemProps {
  product: Product
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
//# Add a "Read More -->" button that goes to /products/:id
//# There you will have a page that has title, image, description,
//# price, "Add To Cart" button, etc.
//# In particular, we want to add both "stock" and "description" to products data.

//# The cards should have links on the image and the title, NOT the entire card.

export const ProductItem = ({ product }: ProductItemProps) => {
  const { addOneToCart, removeOneFromCart, removeFromCart, cartItems } =
    useCartContext()
  const cartItem = cartItems.find((item) => item.id === product._id)

  /* ======================
        renderButton()
  ====================== */

  const renderButton = () => {
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
          return
  ====================== */

  return (
    <div className='relative flex flex-col overflow-hidden rounded-lg border border-blue-500 bg-white shadow'>
      <Link
        to={`/products/${product._id}`}
        className='flex flex-1 flex-col text-left'
      >
        <div className='aspect-square'>
          <img
            src={`${product.image}`}
            alt={product.name}
            className='block w-full object-contain'
          />
        </div>

        <div className='flex-1 px-2'>
          <h5 className='mb-0 text-lg font-semibold text-blue-500'>
            {product.name}
          </h5>

          <div className='flex flex-wrap items-center gap-4'>
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
            ${product.price.toLocaleString()}
          </div>
        </div>
      </Link>

      {renderButton()}
    </div>
  )
}
