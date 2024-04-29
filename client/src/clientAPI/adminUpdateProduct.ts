type Data = Product | null
type AdminUpdateProductResponse = API_Response<Data>

type RequestData = {
  name: string
  description: string
  //# image: string
  price: number
  brand: string
  category: string
  stock: number
  isActive: boolean
}

type AdminUpdateProduct = (
  productId: string,
  data: RequestData
) => AdminUpdateProductResponse

/* ========================================================================

======================================================================== */

export const adminUpdateProduct: AdminUpdateProduct = async (
  productId,
  data
): ReturnType<AdminUpdateProduct> => {
  try {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    const json = (await res.json()) as Awaited<ReturnType<AdminUpdateProduct>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
