import { useNavigate } from 'react-router-dom'

// Custom imports
import { useTitle } from 'hooks'
import { Button, HR } from 'components'
import { useThemeContext } from 'contexts'
import { CreateProductForm } from './components'

const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ddd6fe'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
const darkBackgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23083344'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`

/* ========================================================================
                              PageAdminCreateProduct
======================================================================== */

const PageAdminCreateProduct = () => {
  const navigate = useNavigate()
  useTitle('Admin Create Product')
  const { mode } = useThemeContext()

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
            Admin Create Product
          </span>
          <span
            className='bg-gradient-to-r from-violet-700 to-sky-400 bg-clip-text text-transparent'
            style={{
              position: 'relative'
            }}
          >
            Admin Create Product
          </span>
        </h1>

        <HR style={{ marginBottom: 50 }} />

        <CreateProductForm />
      </div>

      <Button
        className='btn-blue btn-sm absolute left-4 top-4'
        onClick={() => {
          navigate(-1)
        }}
      >
        <svg
          width='2em'
          height='2em'
          fill='currentColor'
          viewBox='0 0 16 16'
          style={{ margin: '-10px -5px' }}
        >
          <path
            fillRule='evenodd'
            d='M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5'
          />
        </svg>
        Back
      </Button>
    </div>
  )
}

export default PageAdminCreateProduct
