type Data = Product | null
type CreateProductReviewResponse = API_Response<Data>

type RequestData = {
  comment: string
  rating: number
}

type CreateProductReview = (
  productId: string,
  requestData: RequestData
) => CreateProductReviewResponse

/* ========================================================================

======================================================================== */

export const createProductReview: CreateProductReview = async (
  productId,
  requestData
): ReturnType<CreateProductReview> => {
  try {
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(requestData)
    })

    const json = (await res.json()) as Awaited<ReturnType<CreateProductReview>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
