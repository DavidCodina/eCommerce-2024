type Data = User | null

type RegisterResponse = API_Response<Data>

type RequestData = {
  userName: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

type Register = ({
  userName,
  firstName,
  lastName,
  email,
  password,
  confirmPassword
}: RequestData) => RegisterResponse

/* ========================================================================

======================================================================== */

export const register: Register = async ({
  userName = '',
  firstName = '',
  lastName = '',
  email = '',
  password = '',
  confirmPassword = ''
}): ReturnType<Register> => {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName,
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      }),

      // Gotcha: In order for the httpOnly cookie to be set in browser application storage.
      // You need to implement credentials: 'include' here. Then you ALSO need to set it on
      // any subsequent outgoing requests to protected endpoints.
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<ReturnType<Register>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
