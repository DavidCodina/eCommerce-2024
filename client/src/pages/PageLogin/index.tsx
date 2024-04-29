import { Navigate, useSearchParams } from 'react-router-dom'

// Custom imports
import { useTitle } from 'hooks'
import { HR } from 'components'
import { useThemeContext, useAuthContext } from 'contexts'
import { LoginForm } from './components'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

/* ========================================================================

======================================================================== */

const PageLogin = () => {
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')

  // Even though the redirect was likely encoded, you shouldn't need to decode it here.
  // At least with React Router's searchParams.get('redirect'), it seems to do it automatically.
  // const decodedRedirect = typeof redirect === 'string' ? decodeURIComponent(redirect) : ''
  useTitle('Login')
  const { mode } = useThemeContext()
  const { authData } = useAuthContext()

  /* ======================
          return
  ====================== */

  const fullPath =
    redirect && typeof redirect === 'string' ? redirect : '/store'

  if (authData) {
    return <Navigate to={fullPath} replace />
  }

  return (
    <div
      className={`
      mx-auto flex w-full flex-1 flex-wrap`}
      style={{
        backgroundImage: mode === 'dark' ? darkBackgroundImage : backgroundImage
      }}
    >
      <div
        className='relative mx-auto w-full flex-1 p-6 2xl:container'
        style={{ minHeight: '200vh' }}
      >
        <h1
          className='text-center text-5xl font-black'
          style={{ position: 'relative', marginBottom: 24 }}
        >
          <span
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textShadow:
                '0px 0px 1px rgba(0,0,0,1), 0px 0px 1px rgba(0,0,0,1)',
              width: '100%',
              height: '100%'
            }}
          >
            Login
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Login
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        <LoginForm />
      </div>
    </div>
  )
}

export default PageLogin
