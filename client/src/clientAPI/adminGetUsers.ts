type Data = User[] | null
type AdminGetUsersResponse = API_Response<Data>
type AdminGetUsers = () => AdminGetUsersResponse

export const adminGetUsers: AdminGetUsers = async (): AdminGetUsersResponse => {
  try {
    const res = await fetch('/api/admin/users', {
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<ReturnType<AdminGetUsers>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
