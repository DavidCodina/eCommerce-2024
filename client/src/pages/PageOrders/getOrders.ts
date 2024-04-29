type GetOrdersResponse = API_Response<Order[] | null>
type GetOrders = () => GetOrdersResponse

/* ========================================================================

======================================================================== */

export const getOrders: GetOrders = async (): ReturnType<GetOrders> => {
  try {
    const res = await fetch(`/api/orders`, {
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<ReturnType<GetOrders>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
