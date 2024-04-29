type Data = Order | null
type AdminGetOrderResponse = API_Response<Data>
type AdminGetOrder = (orderId: string) => AdminGetOrderResponse

/* ========================================================================

======================================================================== */

export const adminGetOrder: AdminGetOrder = async (
  orderId: string
): ReturnType<AdminGetOrder> => {
  try {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<ReturnType<AdminGetOrder>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
