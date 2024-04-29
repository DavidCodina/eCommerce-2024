type Data = Order | null

type AdminUpdateOrderToDeliveredResponse = API_Response<Data>

type AdminUpdateOrderToDelivered = (
  orderId: string
) => AdminUpdateOrderToDeliveredResponse

/* ========================================================================

======================================================================== */

export const adminUpdateOrderToDelivered: AdminUpdateOrderToDelivered = async (
  orderId: string
): ReturnType<AdminUpdateOrderToDelivered> => {
  try {
    const res = await fetch(`/api/admin/orders/${orderId}/delivered`, {
      method: 'PATCH',
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<
      ReturnType<AdminUpdateOrderToDelivered>
    >

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
