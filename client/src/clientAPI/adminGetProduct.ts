type Data = Product | null
type AdminGetProductResponse = API_Response<Data>
type AdminGetProduct = (productId: string) => AdminGetProductResponse

export const adminGetProduct: AdminGetProduct = async (
  productId
): ReturnType<AdminGetProduct> => {
  try {
    const res = await fetch(`/api/admin/products/${productId}`, {
      credentials: 'include'
    })
    const json = (await res.json()) as Awaited<ReturnType<AdminGetProduct>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
