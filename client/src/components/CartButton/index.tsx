import { ComponentProps } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartContext } from 'contexts'

type CartButtonProps = ComponentProps<'button'>

/* ========================================================================
                                CartButton
======================================================================== */

export const CartButton = ({
  className = '',
  style = {},
  ...otherProps
}: CartButtonProps) => {
  const { cartItemCount } = useCartContext()
  const navigate = useNavigate()

  /* ======================
          return
  ====================== */

  return (
    <button
      className={`relative${className ? ` ${className}` : ''}`}
      title='View Cart'
      onClick={() => {
        navigate('/cart')
      }}
      style={style}
      {...otherProps}
    >
      {/* <svg
        className='relative right-1'
        width='36'
        height='36'
        viewBox='0 0 24 24'
        strokeWidth='1.25'
        stroke='currentColor'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
        <path d='M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z' />
        <path d='M9 11v-5a3 3 0 0 1 6 0v5' />
      </svg> */}

      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        aria-hidden='true'
        role='img'
        aria-label='Cart Icon'
        fill='currentColor'
        height='36px'
        width='36px'
      >
        <path d='M9 22.5c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zM9 18c-.83 0-1.5.67-1.5 1.5S8.17 21 9 21s1.5-.67 1.5-1.5S9.83 18 9 18zm10 4.5c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm0-4.5c-.83 0-1.5.67-1.5 1.5S18.17 21 19 21s1.5-.67 1.5-1.5S19.83 18 19 18z'></path>
        <path d='M18.75 18h-11c-1.24 0-2.25-1.01-2.25-2.25s1.01-2.25 2.25-2.25h11.2c.12 0 .22-.08.24-.2l1.28-5.78c.08-.37-.01-.76-.25-1.05S19.64 6 19.26 6H5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h14.26c.84 0 1.62.38 2.14 1.03.53.65.72 1.5.54 2.32l-1.28 5.78c-.18.81-.88 1.37-1.71 1.37H7.75c-.41 0-.75.34-.75.75s.34.75.75.75h11c.41 0 .75.34.75.75s-.34.75-.75.75z'></path>
        <path d='M7.25 15c-.34 0-.64-.23-.73-.57L3.9 3.95A1.25 1.25 0 0 0 2.69 3h-.94C1.34 3 1 2.66 1 2.25s.34-.75.75-.75h.94c1.26 0 2.36.86 2.67 2.08l2.62 10.49a.748.748 0 0 1-.73.93z'></path>
      </svg>

      <span className='absolute -right-3 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-red-500 text-xs text-white'>
        {cartItemCount}
      </span>
    </button>
  )
}
