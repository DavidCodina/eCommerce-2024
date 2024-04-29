import { ComponentProps /*, forwardRef */ } from 'react'
import { RadixModal } from 'components/RadixModal'
import { Button } from 'components'
import { CartTable } from '../CartTable'
import { useCartContext } from 'contexts'

interface CartModalProps extends ComponentProps<typeof RadixModal> {}

type CheckoutResponse = Promise<{
  data: string | null
  message: string
  success: boolean
}>

const checkout = async (cartItems: CartItem[]): CheckoutResponse => {
  try {
    const res = await fetch('http://localhost:5000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cartItems: cartItems
      })
    })

    const data = await res.json()

    return data as CheckoutResponse
  } catch (err) {
    return {
      data: null,
      message: 'Checkout failed.',
      success: false
    }
  }
}

/* ========================================================================

======================================================================== */
//# WDS at 45:00 https://www.youtube.com/watch?v=lATafp15HWA
//# Builds out a right-aligned offCanvas rather than a modal.
//# If you go that route, then make sure it mounts/unmounts with
//# the opening/closing of the OffCanvas.
//# Additionally, the functions for handling that be through the CartContext.

export const CartModal = ({
  open,
  setOpen,
  trigger,
  ...otherProps
}: CartModalProps) => {
  const { cartItems } = useCartContext()

  /* ======================
        handleCheckout()
  ====================== */
  //# This is temporary. Ultimately, we probably want a dedicated /cart page.
  //# We would also want to integrate shipping and tax, etc.

  const handleCheckout = async () => {
    checkout(cartItems)
      .then((result) => {
        // Forward user to stripe:
        // https://checkout.stripe.com/c/pay/cs_test_...

        //# Once we are redirected to the success page, we probably also want to clear
        //# the cartItems data from CartContext.
        if (result.success === true && typeof result.data === 'string') {
          window.location.assign(result.data)
        }

        return result
      })
      .catch((err) => {
        // Will never happen because it's caugh in checkout().
        console.log('checkout() error:', err)
      })
  }

  /* ======================
      renderCartInfo()
  ====================== */

  const renderCartInfo = () => {
    if (cartItems.length === 0) {
      return (
        <div className='py-12 text-center text-2xl font-black text-blue-500'>
          You have no items in your cart!
        </div>
      )
    }

    return <CartTable />
  }

  /* ======================
          return
  ====================== */

  return (
    <RadixModal
      {...otherProps}
      // You almost always want to use the trigger prop over an external/programmatic trigger.
      // Why? Because the button is implemented with Radix's Trigger, then by default focus will go
      // back to the trigger element when the dialog/modal is closed. This is not true if one was
      // using some random programmatic button.
      trigger={trigger}
      open={open}
      setOpen={setOpen}
    >
      <h4 className='mb-4 font-black text-blue-500'>Shopping Cart Summary:</h4>

      {/* In general, any content that manages some localstate should abstracted into its own component.
      That way when the Modal closes, the content's state will be reset when unmounted.
      This point is emphasized in the following Sam Selikoff tutorial at 12:30 : https://www.youtube.com/watch?v=3ijyZllWBwU 
      Conversely, if you want the state to persist (e.g., a modal that shows API data that rarely changes).
      Then implement the state directly within this component. 
      <SomeStatefulComponent /> */}
      {renderCartInfo()}

      <div className='flex flex-wrap justify-center gap-4'>
        <Button
          className='btn-blue btn-sm'
          onClick={() => {
            setOpen?.(false)
          }}
          style={{ minWidth: 150 }}
        >
          Continue Shopping
        </Button>
        <Button
          className='btn-green btn-sm'
          onClick={() => {
            handleCheckout()
          }}
          style={{ minWidth: 150 }}
        >
          Purchase Items
        </Button>
      </div>
    </RadixModal>
  )
}
