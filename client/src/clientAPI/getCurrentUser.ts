type Data = User | null
type GetCurrentUserResponse = API_Response<Data>
type GetCurrentUser = () => GetCurrentUserResponse

/* ========================================================================

======================================================================== */

export const getCurrentUser: GetCurrentUser =
  async (): ReturnType<GetCurrentUser> => {
    try {
      const res = await fetch(`/api/users/current`, {
        credentials: 'include'
      })

      const json = (await res.json()) as Awaited<ReturnType<GetCurrentUser>>

      return json
    } catch (err) {
      return {
        data: null,
        message: 'Request failed.',
        success: false
      }
    }
  }
