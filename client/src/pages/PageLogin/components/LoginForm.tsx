// Third-party imports
import { useState } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons' // https://github.com/FortAwesome/react-fontawesome

// Custom imports
import { useAuthContext } from 'contexts'

/* ========================================================================
                              LoginForm 
======================================================================== */
// Unlike in RegisterForm, this form does not receive an errors
// object from the server. Moreover, we DO NOT render field-specific errors
// to the user. Instead, we remain opaque.

const LoginForm = () => {
  const { logIn } = useAuthContext()
  const [loggingIn, setLoggingIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setPasswordType] = useState('password')

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    if (email.trim() === '' || password.trim() === '') {
      toast.error('Please complete all form fields.')
      setPassword('')
      setPasswordType('password')
      return
    }

    const user = { email: email.trim(), password: password }

    setLoggingIn(true)

    logIn(user)
      .then((json) => {
        const { message, success } = json
        if (success === true) {
          setEmail('')
          setPassword('')
          setPasswordType('password')
        } else {
          toast.error(message)
          setPasswordType('password')
          setLoggingIn(false)
        }

        setEmail('')
        setPassword('')
        setPasswordType('password')
        setLoggingIn(false)
        return json
      })

      // logIn() catches errors internally, so this should never happen.
      .catch((err) => {
        setEmail('')
        setPassword('')
        setPasswordType('password')
        setLoggingIn(false)

        return err
      })
  }

  /* ======================
          return
  ====================== */

  return (
    <div className='mx-auto' style={{ maxWidth: 500 }}>
      <form
        className='mx-auto mb-6 max-w-lg overflow-hidden rounded-lg border border-neutral-500 bg-[#fafafa] p-4 shadow'
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
      >
        <div className='mb-4'>
          <label htmlFor='email' className='text-sm font-black text-blue-500'>
            Email: <sup className='text-red-500'>*</sup>
          </label>
          <input
            autoComplete='off'
            className='form-control form-control-sm'
            id='email'
            name='email'
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email...'
            spellCheck={false}
            type='email'
            value={email}
          />
        </div>

        <div className='mb-4'>
          <label
            className='text-sm font-black text-blue-500'
            htmlFor='password'
          >
            Password: <sup className='text-red-500'>*</sup>
          </label>

          <div className='input-group'>
            <input
              autoComplete='off'
              className='form-control form-control-sm'
              id='password'
              name='password'
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password...'
              spellCheck={false}
              type={passwordType}
              value={password}
            />

            <button
              className='btm-sm btn-blue'
              type='button'
              onClick={() => {
                setPasswordType((previousValue) => {
                  if (previousValue === 'password') {
                    return 'text'
                  }
                  return 'password'
                })
              }}
            >
              {passwordType === 'password' ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
        </div>

        {loggingIn ? (
          <button className='btn-blue btn-sm mb-2 w-full' disabled>
            <span
              className='spinner-border spinner-border-sm mr-2'
              role='status'
              aria-hidden='true'
            ></span>
            Logging In...
          </button>
        ) : (
          <button
            className='btn-blue btn-sm mb-2 w-full'
            onClick={handleSubmit}
          >
            Log In
          </button>
        )}
      </form>
    </div>
  )
}

export { LoginForm }
