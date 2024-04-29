export type AdminPaginatedProductsData = {
  products: Product[]
  count: number
  previousPage: number | null
  currentPage: number
  nextPage: number | null
  isNextPage: boolean
  isPreviousPage: boolean
  pages: number
}

type Data = AdminPaginatedProductsData | null

type AdminGetProductsResponse = API_Response<Data>
type AdminGetProducts = (queryString?: string) => AdminGetProductsResponse

export const adminGetProducts: AdminGetProducts = async (
  queryString = ''
): AdminGetProductsResponse => {
  try {
    const URL = `/api/admin/products${queryString}`
    const res = await fetch(URL, {
      credentials: 'include'
    })
    const json = (await res.json()) as Awaited<ReturnType<AdminGetProducts>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
