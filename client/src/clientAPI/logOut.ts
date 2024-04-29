type Data = null
type LogOutResponse = API_Response<Data>
type LogOut = () => LogOutResponse

/* ========================================================================

======================================================================== */

export const logOut: LogOut = async (): ReturnType<LogOut> => {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<ReturnType<LogOut>>

    return json
  } catch (err) {
    if (err instanceof Error) {
      console.log({ name: err.name, message: err.message })
    }

    return {
      data: null,
      message: 'Unable to log out.',
      success: false
    }
  }
}
