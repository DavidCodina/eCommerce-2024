// Third-Party imports
import { Navigate, Outlet, useLocation } from 'react-router-dom'

// Custom imports
import { useAuthContext } from 'contexts'

interface IPrivateRoutes {
  allowedRoles?: Roles[]
}

/* ========================================================================
                            PrivateRoutes
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   <Route element={<PrivateRoutes />}>
//     <Route path='/protected' element={<PageProtected />} />
//
//     ...
//   </Route>
//
//   <Route element={<PrivateRoutes allowedRoles={admin as any} />}>
//     <Route path='/admin' element={<PageAdmin />} />
//     ...
//   </Route>
//
///////////////////////////////////////////////////////////////////////////

export const PrivateRoutes = ({ allowedRoles = ['user'] }: IPrivateRoutes) => {
  const location = useLocation()
  const fullPath = `${location.pathname}${location.search}${location.hash}`
  const userLoggedOut = fullPath.indexOf('logout=true') !== -1 ? true : false
  const encodedRedirect = encodeURIComponent(fullPath)
  ///////////////////////////////////////////////////////////////////////////
  //
  // Then any component that needs to potentially access the redirect
  // search param will need to make sure to use something like:
  // const decodedRedirect = decodeURIComponent(encodedRedirect)
  // Actually, decoding the path doesn't seem to be necessary.
  // At least with React Router's searchParams.get('redirect'), it seems to do it automatically.
  // Presently, this is being used only in PageLogin.
  //
  // Note: React Router has a way to pass this data through <Navigate />,
  // but it's more conventional and (arguably better) to just use search params.
  //
  ///////////////////////////////////////////////////////////////////////////

  const { authData } = useAuthContext()
  const roles = authData?.roles || []

  let userHasRole = false

  // http://localhost:3000/shipping?test=testing123&name=david#area1

  /* ======================
  Check user's roles against allowedRoles
  ====================== */
  // Loop through allowedRoles. Check user roles against
  // each allowedRole for a potential match.

  for (let i = 0; i < allowedRoles.length; i++) {
    const allowedRole = allowedRoles[i]

    // We could instead use a nested for loop to avoid having to use includes()
    if (typeof allowedRole === 'string' && roles.includes(allowedRole)) {
      userHasRole = true
      break
    }
  }

  /* ======================
      renderPrivateRoutes
  ====================== */

  const renderPrivateRoutes = () => {
    // User is not allowed to access a private route if they are not authenticated.
    // This is inferred through the existence of authData

    // When a user logs out from an auth page then there is immediately no authData
    // However, we don't want to ALWAYS include a redirect. Thus, in AuthContext the
    // logOut() function also does this:  setSearchParams({ logout: 'true' })
    // Thus we can check userLoggedOut and if true then omit the redirect.
    if (!authData && userLoggedOut) {
      return <Navigate to={`/login`} replace />
    }
    if (!authData) {
      return <Navigate to={`/login?redirect=${encodedRedirect}`} replace />
    }

    // If isAuthenticated, but the user is not authorized for the particular route, then go to '/unauthorized'.
    if (!userHasRole) {
      return <Navigate to='/unauthorized' replace />
    }

    return <Outlet />
  }

  return renderPrivateRoutes()
}
