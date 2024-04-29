type Data = Order | null
type GetOrderResponse = API_Response<Data>
type GetOrder = (orderId: string) => GetOrderResponse

/* ========================================================================

======================================================================== */

export const getOrder: GetOrder = async (
  orderId: string
): ReturnType<GetOrder> => {
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<ReturnType<GetOrder>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
