type Data = Order[] | null
type AdminGetOrdersResponse = API_Response<Data>
type AdminGetOrders = () => AdminGetOrdersResponse

/* ========================================================================

======================================================================== */
//# Add ability to pass in a query search param like:
//# ?orderBy=createdAt&sortBy=desc&filterBy=isDelivered:true
//# For now, I've just hardcoded select=... to what is needed
//# for the UI.

export const adminGetOrders: AdminGetOrders =
  async (): ReturnType<AdminGetOrders> => {
    try {
      const res = await fetch(
        `/api/admin/orders?select=_id,customer,createdAt,total,isPaid,paidAt,isDelivered,deliveredAt`,
        {
          credentials: 'include'
        }
      )

      const json = (await res.json()) as Awaited<ReturnType<AdminGetOrders>>

      return json
    } catch (err) {
      return {
        data: null,
        message: 'Request failed.',
        success: false
      }
    }
  }
