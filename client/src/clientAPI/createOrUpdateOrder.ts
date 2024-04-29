type Customer = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type RequestData = {
  orderId?: string
  cartItems: CartItem[]
  customer: Customer
  shipping: Shipping
}

type Data = Order | null

type CreateOrUpdateOrderResponse = API_Response<Data>

type CreateOrUpdateOrder = ({
  cartItems,
  customer,
  shipping
}: RequestData) => CreateOrUpdateOrderResponse

/* =============================================================================
                                
============================================================================= */

export const createOrUpdateOrder: CreateOrUpdateOrder = async ({
  orderId,
  cartItems,
  customer,
  shipping
}): ReturnType<CreateOrUpdateOrder> => {
  try {
    const res = await fetch(
      '/api/orders',

      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          cartItems,
          customer,
          shipping
        })
      }
    )

    const json = (await res.json()) as Awaited<ReturnType<CreateOrUpdateOrder>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
