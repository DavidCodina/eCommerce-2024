// Third-party imports
import { Fragment, Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Custom imports
import {
  useThemeContext,
  useCartContext,
  useAuthContext,
  useAppContext
} from 'contexts'
import { Menu } from './components/Menu'
import { GlobalSpinner } from './components/GlobalSpinner'
import PageError from 'pages/PageError'

import { sleep } from 'utils'
import { getCurrentUser } from 'clientAPI/getCurrentUser'

// This fallback was used just for testing lazy + preloading, but obviously
// you don't want a big dumb loading h1 every time something lazy loads.
const Fallback = () => {
  return (
    <div className='mx-auto w-full flex-1 p-6 2xl:container'>
      <h1 className='tex-6xl py-5 text-center font-black text-red-500'>
        Thinking...
      </h1>
    </div>
  )
}

/* ========================================================================
                              MainLayout
======================================================================== */

export const MainLayout = () => {
  const { mode } = useThemeContext()
  const { setUser, setUserStatus } = useAppContext()
  const { authData } = useAuthContext()
  const { clearCart, setCurrentOrder } = useCartContext()

  /* ======================
        handleError()
  ====================== */

  const handleError = (_error: any, _errorInfo: any) => {
    // This is where you'd call your logging service.
    // console.log('Error: ', error)
    // console.log('Error Info: ', errorInfo)
  }

  /* ======================
        handleReset()
  ====================== */

  const handleReset = () => {
    // console.log('handleReset() was called.')
  }

  /* ======================
  useEffect() : Critical Data
  ====================== */
  // This runs on mount, but on mount the user might not be logged in yet.
  // This means we need authData as a dependency. And because we need
  // authData, we need to run this outside of AppContext itself.

  useEffect(() => {
    if (authData) {
      setUserStatus('pending')
      getCurrentUser()
        .then(async (json) => {
          await sleep(1500)
          const { success, data } = json

          if (success === true && data && typeof data === 'object') {
            setUser(data)
            setUserStatus('success')
          } else {
            setUserStatus('error')
          }
          return json
        })
        .catch((err) => {
          setUserStatus('error')
          return err
        })
    }
  }, [authData, setUser, setUserStatus])

  /* ======================
    useEffect() : log out
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // When a user logs out, the logOut() function sets authData to null.
  // However, we also need to remove state from CartContext. Because
  // AuthContext and CartContext providers are consumed at the same level,
  // we actually need to go down a level before they are both available.
  // In other words, we can't merely implement useCartContext() from within
  // the AuthContext.
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!authData) {
      clearCart()
      setCurrentOrder('')
      setUser(null)
    }
  }, [authData]) // eslint-disable-line

  /* ======================
          return
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Initially, the top-level element was <Fragment>. However, once
  // the Tailwind theme (light/dark mode) was implemented, I needed
  // a place to conditionally set the background color and text color.
  //
  ///////////////////////////////////////////////////////////////////////////

  return (
    <Fragment>
      <ToastContainer
        autoClose={3000}
        theme={mode === 'dark' ? 'dark' : 'light'}
      />

      <div
        className={`flex w-full flex-1 transition-[background] duration-300 ease-linear dark:bg-[var(--tw-dark-body-color)] dark:text-[var(--tw-dark-text-color)]`}
      >
        <ErrorBoundary
          FallbackComponent={PageError}
          onError={handleError}
          onReset={handleReset}
        >
          <GlobalSpinner delay={750}>
            <Suspense fallback={<Fallback />}>
              <Outlet context={{ test: 'Outlet value!' }} />
            </Suspense>
          </GlobalSpinner>
        </ErrorBoundary>

        {/* For precedence, it's important that the <Menu /> comes after the other JSX. */}
        <Menu />
      </div>
    </Fragment>
  )
}

export default MainLayout
