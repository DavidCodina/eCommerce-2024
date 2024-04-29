type Data = User | null
type AdminGetUserResponse = API_Response<Data>
type AdminGetUser = (userId: string) => AdminGetUserResponse

export const adminGetUser: AdminGetUser = async (
  userId
): ReturnType<AdminGetUser> => {
  try {
    const res = await fetch(`/api/admin/users/${userId}`, {
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<ReturnType<AdminGetUser>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
