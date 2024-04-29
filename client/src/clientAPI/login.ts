type Data = User | null

type LoginResponse = API_Response<Data>

type RequestData = {
  email: string
  password: string
}

export type Login = ({ email, password }: RequestData) => LoginResponse

/* ========================================================================

======================================================================== */

export const logIn: Login = async ({ email, password }): ReturnType<Login> => {
  try {
    const res = await fetch(
      ///////////////////////////////////////////////////////////////////////////
      //
      // '/api/auth/login' works because vite.config.ts has a proxy set up.
      // This is not only convenient for writing API endpoints, it's also
      // important in order to trick the browser to accept httpOnly cookies from
      // localhost:5000. That said, you can still receive the httpOnly cookie
      // from the server using:
      //
      //-  `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`
      //   'http://localhost:5000/api/auth/login'
      //
      // Just make sure to set credentials: 'include' on the '/login' and '/register' requests.
      // In other words, it WILL set the cookie from localhost:5000 to the browser's application
      // storage for localhost:3000.
      //
      ///////////////////////////////////////////////////////////////////////////
      '/api/auth/login',

      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),

        // Gotcha: In order for the httpOnly cookie to be set in browser application storage.
        // You need to implement credentials: 'include' here. Then you ALSO need to set it on
        // any subsequent outgoing requests to protected endpoints.
        credentials: 'include'
      }
    )

    const json = (await res.json()) as Awaited<ReturnType<Login>>

    return json
  } catch (err) {
    if (err instanceof Error) {
      console.log({ name: err.name, message: err.message })
    }

    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
