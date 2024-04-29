import { Navigate } from 'react-router-dom'

// Custom imports
import { useTitle } from 'hooks'
import { HR } from 'components'
import { useThemeContext, useAuthContext } from 'contexts'
import { RegisterForm } from './components'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

/* ========================================================================

======================================================================== */

const PageRegister = () => {
  useTitle('Register')
  const { mode } = useThemeContext()
  const { authData } = useAuthContext()

  /* ======================
          return
  ====================== */

  if (authData) {
    return <Navigate to={'/store'} replace />
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
            Register
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Register
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        <RegisterForm />
      </div>
    </div>
  )
}

export default PageRegister
