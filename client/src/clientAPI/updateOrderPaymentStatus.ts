type Data = null
type UpdateOrderPaymentStatusResponse = API_Response<Data>
type UpdateOrderPaymentStatus = (
  orderId: string
) => UpdateOrderPaymentStatusResponse

export const updateOrderPaymentStatus: UpdateOrderPaymentStatus = async (
  orderId
): ReturnType<UpdateOrderPaymentStatus> => {
  try {
    const res = await fetch(`/api/orders/update-payment-status/${orderId}`, {
      method: 'PATCH'
    })

    const json = (await res.json()) as Awaited<
      ReturnType<UpdateOrderPaymentStatus>
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
