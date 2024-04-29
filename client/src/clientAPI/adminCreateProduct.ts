type Data = Product | null
type AdminCreateProductResponse = API_Response<Data>

type NewProduct = {
  name: string
  description: string
  price: number
  brand: string
  category: string
  stock: number
}
type AdminCreateProduct = (newProduct: NewProduct) => AdminCreateProductResponse

/* ========================================================================

======================================================================== */

export const adminCreateProduct: AdminCreateProduct = async (
  newProduct
): ReturnType<AdminCreateProduct> => {
  try {
    const res = await fetch(`/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        product: newProduct
      })
    })

    const json = (await res.json()) as Awaited<ReturnType<AdminCreateProduct>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
