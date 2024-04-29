import {
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  createContext,
  useContext,
  useCallback
} from 'react'
import { toast } from 'react-toastify'
import { useLocalStorage } from 'hooks'
import { getCartProducts } from 'clientAPI'

export default interface CartContextValue {
  cartItems: CartItem[]
  setCartItems: Dispatch<SetStateAction<CartItem[]>>
  cartItemCount: number
  addOneToCart: (product: Product) => void
  removeOneFromCart: (productId: string) => void
  clearCart: () => void
  removeFromCart: (productId: string) => void
  getItemQuantityById: (productId: string) => number | null
  getCartProducts: typeof getCartProducts
  currentOrder: string
  setCurrentOrder: Dispatch<SetStateAction<string>>
  // [key: string]: any
}

/* ========================================================================

======================================================================== */

export const CartContext = createContext({} as CartContextValue)
export const CartConsumer = CartContext.Consumer

export const CartProvider = ({ children }: PropsWithChildren) => {
  // Each cartItem includes quantity for that item as well as the id.
  // We don't want to include too much data here because we will be serialzing the CartItem[] and storing
  // it in localStorage. Additinally, any other data may be sumbect to change (e.g., name, price, etc),
  // so we always want to get the info dynamically.

  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cartItems', [])
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // setCurrentOrder('...') is called from OrderPage when authenticated
  // user chooses to continue purchasing for that order.
  //
  // When currentOrder changes, call a function that gets the order and
  // resets cartItems. Presently, this will just be done from PageOrder.
  // But it could be done here if setCurrentOrder is used all over the app.
  const [currentOrder, setCurrentOrder] = useLocalStorage<string>(
    'currentOrder',
    ''
  )

  /* ======================
        addOneToCart()
  ====================== */
  // Initially, this just took the productId as an argument.
  // However, if we pass the entire product, we can then compare
  // quantitySelectedOfCurrentProduct against product.stock.
  // Ultimately, stock checks will also be performed on the
  // server prior to creating an order and paying for the order, but
  // doing it here is also a good idea.

  const addOneToCart = (product: Product) => {
    const productId = product._id
    const quantitySelectedOfCurrentProduct = (() => {
      let qty = 0
      const foundItem = cartItems.find((item) => item.id === productId)
      if (foundItem) {
        qty = foundItem.quantity
      }
      return qty
    })()

    // Prevent item quantity from exceeding known stock.
    if (quantitySelectedOfCurrentProduct >= product.stock) {
      toast.warn('Stock exhausted.')
      return
    }

    setCartItems((prevCartItems) => {
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem.id === productId
      )

      if (existingCartItem) {
        existingCartItem.quantity += 1
        return [...prevCartItems]
      }

      const newCartItem = {
        quantity: 1,
        id: productId
        // price and name should be derived from the database whenever displaying cart info.
        // One reason for this is to keep CartItem[] as small as possible. However, another
        // reason is that prices may change and we always want it to be dynamically generated.
        // price: price,
        // name: name
      }

      return [newCartItem, ...prevCartItems]
    })
  }

  /* ======================
      removeOneFromCart()
  ====================== */

  const removeOneFromCart = (productId: string) => {
    setCartItems((prevCartItems) => {
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem.id === productId
      )

      if (!existingCartItem) {
        return prevCartItems
      }

      if (existingCartItem.quantity > 1) {
        existingCartItem.quantity -= 1

        // This will almost surely never occur, but it's a failsafe.
        if (existingCartItem.quantity < 0) {
          existingCartItem.quantity = 0
        }
        return [...prevCartItems]
      }

      const newCartItems = [...prevCartItems]
      return newCartItems.filter((item) => item.id !== productId)
    })
  }

  /* ======================
      removeFromCart()
  ====================== */
  // Removes all of that product from the cart.

  const removeFromCart = (productId: string) => {
    setCartItems((prevCartItems) => {
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem.id === productId
      )

      if (!existingCartItem) {
        return prevCartItems
      }

      const newCartItems = [...prevCartItems]
      return newCartItems.filter((item) => item.id !== productId)
    })
  }

  /* ======================
         clearCart()
  ====================== */
  //  Wrap in useCallback because it will be consumed inside of a useEffect().

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [setCartItems])

  /* ======================
    getItemQuantityById()
  ====================== */

  const getItemQuantityById = (productId: string) => {
    const item = cartItems.find((item) => item.id === productId)

    if (item && typeof item.quantity === 'number') {
      return item.quantity
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartItemCount,
        addOneToCart,
        removeOneFromCart,
        //# Add clearCart(), which completely empties out cart.
        //# This will be used on the '/cart' page if the user wants
        //# to empty out their cart. It will also be used after
        //# a successful checkout (i.e., in the success page.)
        clearCart,
        removeFromCart,
        getItemQuantityById,
        getCartProducts,
        currentOrder,
        setCurrentOrder
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const value = useContext(CartContext)
  return value
}
