// Third-party imports
import { createContext, ReactNode, useContext } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

// Custom imports
import { useLocalStorage } from 'hooks'
import { register, logIn, logOut } from 'clientAPI'

// Even if the register and logIn functions return the entire user object, we don't
// need AuthData to contain all of that. Ultimately, we want authData to be as
// slim as possible. Thus, we can limit it to merely _id and roles.
type AuthData = { _id: User['_id']; roles: User['roles'] } | null

type RegisterRequestData = Parameters<typeof register>[0]
type LoginRequestData = Parameters<typeof logIn>[0]
type AuthContextValue = {
  authData: AuthData
  register: (requestData: RegisterRequestData) => ReturnType<typeof register>
  logIn: (requestData: LoginRequestData) => ReturnType<typeof logIn>
  logOut: () => ReturnType<typeof logOut>
}

export const AuthContext = createContext({} as AuthContextValue)
export const AuthConsumer = AuthContext.Consumer

/* ========================================================================
                                AuthProvider
======================================================================== */
//# Eventually add react-idle-timer implementation to this app.
//# Review note in PrivateRoutes to possibly change the implementation.

export const AuthProvider = (props: { children: ReactNode }) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [authData, setAuthData] = useLocalStorage<AuthData>('authData', null)

  /* ======================
      handleRegister()
  ====================== */

  const handleRegister = async (requestData: RegisterRequestData) => {
    const json = await register(requestData)

    if (
      json.success === true &&
      json.data &&
      json.data?._id &&
      Array.isArray(json.data?.roles)
    ) {
      const newAuthData: AuthData = {
        _id: json.data._id,
        roles: json.data.roles
      }
      setAuthData(newAuthData)
    }

    return json
  }

  /* ======================
        handleLogin()
  ====================== */

  const handleLogin = async (requestData: LoginRequestData) => {
    const json = await logIn(requestData)

    if (
      json.success === true &&
      json.data &&
      json.data?._id &&
      Array.isArray(json.data?.roles)
    ) {
      const newAuthData: AuthData = {
        _id: json.data._id,
        roles: json.data.roles
      }
      setAuthData(newAuthData)
    }
    return json
  }

  /* ======================
        handleLogOut()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // When a user logs out, the logOut() function sets authData to null.
  // However, we also need to remove state from CartContext (i.e., cartItems, currentOrder).
  // Because AuthContext and CartContext providers are consumed at the same level (RootLayout),
  // we actually need to go down a level before they are both available. In other words,
  // we can't merely implement useCartContext() from within the AuthContext. Thus the
  // side effect for removing the user's cartItems and currentOrder upon logging out is
  // handled from within MainLayout.tsx.
  //
  ///////////////////////////////////////////////////////////////////////////

  const handleLogOut = async () => {
    const json = await logOut()

    if (json.success === true) {
      setAuthData(null)

      ///////////////////////////////////////////////////////////////////////////
      //
      // The 'logout' query search param is read by <PrivateRoutes /> to conditionally apply/omit the redirect search
      // parameter such that when a user logs out, redirect="..." is NOT set if 'logout=true' exists.
      // However, 'logout=true' won't get removed by <PrivateRoutes /> if the page they logged out from
      // was public. Thus, we also set a timeout here to remove 'logout=true' 1.5s later. This duration is
      // sufficient for the client logout process to occur. We then resume the normal redirect behavior.
      //
      ///////////////////////////////////////////////////////////////////////////

      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set('logout', 'true')
      setSearchParams(newSearchParams)

      setTimeout(() => {
        // Gotcha: we can't use searchParams from react router dom here because it will be a stale closure.
        const freshSearchParams = new URLSearchParams(window.location.search)
        freshSearchParams.delete('logout')
        setSearchParams(freshSearchParams)
      }, 1500)

      ///////////////////////////////////////////////////////////////////////////
      //
      // The above logic should NOT be necessary if we ALWAYS redirect the user to '/login'
      // Thus, if a user is on a protected page when they log out, <PrivateRoutes /> would ordinarily
      // redirect them. However, if we redirect them here FIRST, then the logic in <PrivateRoutes />
      // won't execute. Again, because we are implementing navigate('/login') below, we can safely
      // comment out the above logic. That said, it doesn't hurt and is still good to have in case
      // we ever decide to remove navigate('/login'). As a reminder the above logic works in
      // conjunction with checks performed in <PrivateRoutes />.
      //
      ///////////////////////////////////////////////////////////////////////////

      navigate('/login')
    } else {
      toast.error('Unable to log out.')
    }
    return json
  }

  /* ======================
          return
  ====================== */

  return (
    <AuthContext.Provider
      value={{
        authData,
        register: handleRegister,
        logIn: handleLogin,
        logOut: handleLogOut
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const value = useContext(AuthContext)
  return value
}
