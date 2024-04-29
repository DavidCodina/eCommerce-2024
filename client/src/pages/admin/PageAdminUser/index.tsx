import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// Custom imports
import { sleep } from 'utils'
import { useTitle } from 'hooks'
import { Alert, HR } from 'components'
import { useThemeContext } from 'contexts'
import { adminGetUser } from 'clientAPI'
import { UpdateUserForm } from './components'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

/* ========================================================================
                                PageAdminUser 
======================================================================== */

const PageAdminUser = () => {
  const { id: userId } = useParams()
  useTitle('Admin User')
  const { mode } = useThemeContext()

  /* ======================
       state & refs
  ====================== */

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  const [user, setUser] = useState<User | null>(null)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    if (!userId || typeof userId !== 'string') {
      return
    }

    setStatus('pending')

    adminGetUser(userId)
      .then(async (json) => {
        await sleep(1500)
        const { success, data } = json

        if (success === true && json && typeof json === 'object') {
          setStatus('success')
          setUser(data)
        } else {
          setStatus('error')
        }

        return json
      })
      .catch((err) => {
        setStatus('error')
        return err
      })
  }, [userId])

  /* ======================
       renderContent()
  ====================== */

  const renderContent = () => {
    if (status === 'error') {
      return (
        <Alert
          className='alert-red mx-auto my-12 max-w-2xl'
          leftSection={
            <svg
              style={{ height: '3em' }}
              fill='currentColor'
              viewBox='0 0 16 16'
            >
              <path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z' />
              <path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z' />
            </svg>
          }
          rightSection={
            <button
              className={`${Alert.redButtonFix} flex w-full active:scale-[0.99]`}
              onClick={() => {
                if (!userId || typeof userId !== 'string') {
                  return
                }

                setStatus('pending')

                adminGetUser(userId)
                  .then(async (json) => {
                    await sleep(1500)
                    const { success, data } = json

                    if (success === true && json && typeof json === 'object') {
                      setStatus('success')
                      setUser(data)
                    } else {
                      setStatus('error')
                    }

                    return json
                  })
                  .catch((err) => {
                    setStatus('error')
                    return err
                  })
              }}
              style={{ minWidth: 100 }}
            >
              Retry
            </button>
          }
          rightClassName='items-end flex'
          centerClassName='flex-1'
        >
          <Alert.Heading>Error!</Alert.Heading>

          <p className='text-sm'>Unable to get user.</p>
        </Alert>
      )
    }

    // Because nothing else is shown on the page, we can get away with position:fixed and centering.
    // Spinner taken from https://nextui.org landing page.
    if (status === 'pending') {
      return (
        <div
          aria-label='Loading'
          className='pointer-events-none fixed inset-0 flex items-center justify-center'
        >
          <div className='relative flex h-20 w-20'>
            <i className='absolute h-full w-full animate-[store-spinner-spin_0.8s_ease_infinite] rounded-full border-[6px] border-solid border-b-violet-800 border-l-transparent border-r-transparent border-t-transparent'></i>
            <i className='absolute h-full w-full animate-[store-spinner-spin_0.8s_linear_infinite] rounded-full border-[6px] border-dotted border-b-violet-800 border-l-transparent border-r-transparent border-t-transparent opacity-75'></i>
          </div>
        </div>
      )
    }
    if (status === 'success' && user) {
      return (
        <UpdateUserForm
          user={user}
          onUpdated={(updatedUser) => {
            if (updatedUser) {
              setUser(updatedUser)
            }
          }}
        />
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <div
      className={`
      mx-auto flex w-full flex-1 flex-wrap`}
      style={{
        backgroundImage: mode === 'dark' ? darkBackgroundImage : backgroundImage
      }}
    >
      <div className='relative mx-auto w-full flex-1 p-6 2xl:container'>
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
            Admin User
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Admin User
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        {renderContent()}
      </div>
    </div>
  )
}

export default PageAdminUser
