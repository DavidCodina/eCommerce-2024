type PayOrderResponse = API_Response<string | null>
type PayOrder = (orderId: string) => PayOrderResponse

/* ========================================================================

======================================================================== */

export const payOrder: PayOrder = async (
  orderId: string
): ReturnType<PayOrder> => {
  try {
    const res = await fetch(
      '/api/orders/pay',

      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId }),
        credentials: 'include'
      }
    )

    const json = (await res.json()) as Awaited<ReturnType<PayOrder>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
