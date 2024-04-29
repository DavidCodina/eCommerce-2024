export type PaginatedProductsData = {
  products: Product[]
  count: number
  previousPage: number | null
  currentPage: number
  nextPage: number | null
  isNextPage: boolean
  isPreviousPage: boolean
  pages: number
}

type Data = PaginatedProductsData | null

type GetProductsResponse = API_Response<Data>
type GetProducts = (queryString?: string) => GetProductsResponse

export const getProducts: GetProducts = async (
  queryString = ''
): GetProductsResponse => {
  try {
    const URL = `/api/products${queryString}`
    const res = await fetch(URL)
    const json = (await res.json()) as Awaited<ReturnType<GetProducts>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
