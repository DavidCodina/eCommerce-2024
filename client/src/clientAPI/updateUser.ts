type RequestData = {
  firstName: string
  lastName: string
  email: string
  password?: string
  confirmPassword?: string
  phone: string
  shipping: Shipping
}

type Data = User | null

type UpdateUserResponse = API_Response<Data>

type UpdateUser = (data: RequestData) => UpdateUserResponse

/* ========================================================================

======================================================================== */

export const updateUser: UpdateUser = async (data): ReturnType<UpdateUser> => {
  try {
    const res = await fetch(`/api/users`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<ReturnType<UpdateUser>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
