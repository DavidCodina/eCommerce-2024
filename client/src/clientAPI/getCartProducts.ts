type Data = Product[] | null
type GetCartProductsResponse = API_Response<Data>
type GetCartProducts = (productIds: string[]) => GetCartProductsResponse

export const getCartProducts: GetCartProducts = async (
  productIds = []
): ReturnType<GetCartProducts> => {
  try {
    const res = await fetch('/api/products/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productIds: productIds
      })
    })

    const json = (await res.json()) as Awaited<ReturnType<GetCartProducts>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
