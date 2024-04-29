type Data = Product | null
type GetProductResponse = API_Response<Data>
type GetProduct = (productId: string) => GetProductResponse

export const getProduct: GetProduct = async (
  productId
): ReturnType<GetProduct> => {
  // await sleep(500)
  // const randomFail = () => { return Math.random() < 0.25 }
  // const shouldFail = randomFail()
  // if (shouldFail) {
  //   return { data: null, message: 'Request failed.', success: false }
  // }

  try {
    const res = await fetch(`/api/products/${productId}`)
    const json = (await res.json()) as Awaited<ReturnType<GetProduct>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
