type Data = User | null
type AdminUpdateUserResponse = API_Response<Data>

type RequestData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  shipping: Shipping
  isActive: boolean
  roles: string[]
}

type AdminUpdateUser = (
  userId: string,
  data: RequestData
) => AdminUpdateUserResponse

/* ========================================================================

======================================================================== */

export const adminUpdateUser: AdminUpdateUser = async (
  userId,
  data
): ReturnType<AdminUpdateUser> => {
  try {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    const json = (await res.json()) as Awaited<ReturnType<AdminUpdateUser>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
