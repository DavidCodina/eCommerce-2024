type Data = Product | null
type AdminSoftDeleteProductResponse = API_Response<Data>
type AdminSoftDeleteProduct = (
  productId: string
) => AdminSoftDeleteProductResponse

/* ========================================================================

======================================================================== */

export const adminSoftDeleteProduct: AdminSoftDeleteProduct = async (
  productId
): ReturnType<AdminSoftDeleteProduct> => {
  try {
    const res = await fetch(`/api/admin/products/${productId}/soft-delete`, {
      method: 'PATCH',
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<
      ReturnType<AdminSoftDeleteProduct>
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
