import { useState } from 'react'
import { useCartContext } from 'contexts'
import { CartModal } from './CartModal'

/* ========================================================================
                                CartButton
======================================================================== */
// Note: having a CartButton that shows the cart info may not be the normal
// way of doing it. Amazon actually has a /cart/view page and from there is
// a button for 'Proceed To Checkout', 0r you can go to cart directly from the store.
//
//# The Code Bootcamp tutorial at 1:44:30 builds out a /cart page.
//# https://www.youtube.com/watch?v=p_q8gy_jmP8
//# That's probably the approach I want to take, rather than having Modal.
//# However, the nice thing about the Modal or OffCanvas approach is that it
//# doesn't require you to switch pages.
//
//# From the /cart page, we will have a button that then says "Go To Checkout."

export const CartButton = () => {
  const { cartItemCount } = useCartContext()
  const [open, setOpen] = useState(false)

  /* ======================
          return
  ====================== */

  return (
    <>
      <CartModal
        centered
        dialogStyle={{
          width: 800,
          maxWidth: 'calc(100vw - 20px)'
        }}
        open={open}
        setOpen={setOpen}
        trigger={
          <button className='relative' title='View Cart'>
            <svg
              className='relative right-1  stroke-white'
              width='36'
              height='36'
              viewBox='0 0 24 24'
              strokeWidth='1'
              stroke='currentColor'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
              <path d='M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z' />
              <path d='M9 11v-5a3 3 0 0 1 6 0v5' />
            </svg>

            <span className='absolute -right-2 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-red-500 text-xs text-white'>
              {cartItemCount}
            </span>
          </button>
        }
      />
    </>
  )
}
