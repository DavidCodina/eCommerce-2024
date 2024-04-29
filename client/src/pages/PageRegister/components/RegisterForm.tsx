// Third-party imports
import { Fragment, useState, useEffect } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons' // https://github.com/FortAwesome/react-fontawesome

// Custom imports
import { schema, FormValues, defaultValues } from './schema'
import { sleep } from 'utils'
import { useAuthContext } from 'contexts'

/* =============================================================================
                                 RegisterForm 
============================================================================= */

const RegisterForm = () => {
  const { register: registerNewUser } = useAuthContext()

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    trigger,
    watch,
    setValue,
    resetField,
    setError,
    // clearErrors,
    formState: {
      errors,
      isValid,
      touchedFields,
      isSubmitted
      // isSubmitting,
      // isSubmitSuccessful
    }
  } = useForm<FormValues>({
    defaultValues: defaultValues,

    // Do NOT use mode: 'all'. Instead use mode: 'onTouched'.
    // This will validate onBlur. Then will subsequently, validate onChange.
    // It will also validate onSubmit.
    // The reason this is important is because the form field components
    // are designed to ALWAYS SHOW Error if there is an error.
    mode: 'onTouched',
    resolver: zodResolver(schema)
  })

  /* ======================
        state & refs
  ====================== */

  // Important: DO NOT use isSubmitting and isSubmitSuccessful.
  // Instead use your own status state. This makes it easier to
  // handle post-request logic from a useEffect after onSubmit completes.
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  const [passwordType, setPasswordType] = useState('password')
  const [confirmPasswordType, setConfirmPasswordType] = useState('password')

  /* ======================
        configureAll()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // https://github.com/react-hook-form/react-hook-form/issues/1418
  // A helper to work around potentially needing all form elements to have been touched.
  // react-hook-form does not actually expose a function like this.
  //
  // At present, we don't need this because we can use the isSubmitted flag
  // to determine whether or not it's appropriate to conditionally use the
  // 'is-valid' class. However, in some cases we may have field components
  // that do not have access to isSubmitted. In that case, configurAll() might
  // be helpful.
  //
  // On the other hand, if a field component has a touched prop, then we
  // can simply set that to something like isSubmitted || touchedFields.email.
  //
  ///////////////////////////////////////////////////////////////////////////

  const _configureAll = (
    config: {
      shouldValidate?: boolean
      shouldDirty?: boolean
      shouldTouch?: boolean
    } = {}
  ) => {
    const values = getValues()
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        const k = key as keyof typeof values
        const v = values[k]
        setValue(k, v, config)
      }
    }
  }

  /* ======================
        onSubmit()
  ====================== */

  const onSubmit: SubmitHandler<FormValues> = async (data, _e) => {
    const { userName, firstName, lastName, email, password, confirmPassword } =
      data

    const newUser = {
      userName,
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    }

    setStatus('pending')

    try {
      await sleep(1500) // Demo only

      const json = await registerNewUser(newUser)

      const { success, errors } = json

      if (success === false) {
        setStatus('error')
        toast.error('Unable to register user.')

        // Clear password and confirmPassword
        resetField('password')
        resetField('confirmPassword')

        if (errors && typeof errors === 'object') {
          if (errors?.userName) {
            setError('userName', {
              message: errors.userName,
              type: 'custom'
            })
          }

          if (errors?.firstName) {
            setError('firstName', {
              message: errors.firstName,
              type: 'custom'
            })
          }

          if (errors?.lastName) {
            setError('lastName', {
              message: errors.lastName,
              type: 'custom'
            })
          }

          if (errors?.email) {
            setError('email', {
              message: errors.email,
              type: 'custom'
            })
          }
          if (errors?.password) {
            setError('password', {
              message: errors.password,
              type: 'custom'
            })
          }

          if (errors?.confirmPassword) {
            setError('confirmPassword', {
              message: errors.confirmPassword,
              type: 'custom'
            })
          }
        }
      } else if (success === true) {
        setStatus('success')
        toast.success('User registration success!')
      }
      return json
      // register() catches errors internally, so this should never happen.
    } catch (err) {
      setStatus('error')
      resetField('password')
      resetField('confirmPassword')
      toast.error('Unable to register user.')
      return err
    } finally {
      setPasswordType('password')
      setConfirmPasswordType('password')
    }
  }

  /* ======================
        onError()
  ====================== */
  // No need to do anything here.

  const onError: SubmitErrorHandler<FormValues> = (_errors, _e) => {
    // const values = getValues()
    // console.log({ values, errors })
    // toast.error('Please correct form validation errors!')
  }

  /* ======================
        useEffect()
  ====================== */
  //# I think there's a better way where watch is actually passed into the useEffect().
  //# See here: https://www.youtube.com/watch?v=JhtuoyCGIA0&list=PLC3y8-rFHvwjmgBr1327BA5bVXoQH-w5s&index=17

  const password = watch('password')
  const confirmPasswordTouched = touchedFields.confirmPassword

  useEffect(() => {
    if (confirmPasswordTouched) {
      trigger('confirmPassword')
    }
  }, [password, confirmPasswordTouched, trigger])

  /* ======================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // It's recommended to NOT call reset() from within the onSubmit() function.
  // However, isSubmitSuccesful only indicates that onSubmit fired and completed.
  // Thus, you could have an unsuccessful API response, but the onSubmit itself
  // would still generate a true isSubmitSuccessful. In order to fix that, once
  // could set a temporary error just long enough to change
  // isSubmitSuccessful to false:
  //
  //   useForm<FormValues & { api: string }>( ... )
  //   setError('api', { type: 'server', message: 'Error' })
  //
  // This would be done in the onSubmit, then cleared in this useEffect.
  // However, calling clearErrors('api') would still not be sufficient for react hook form
  // to update isValid back to true. Moreover, if there are server generated errors, we
  // don't want to trigger revalidation because that would automatically erase them.
  // Consequently, it's actually just easier to NOT use isSubmitSuccessful at all!
  // Instead, create status state and use that.
  //
  // Note: if status === 'success', THIS page will actually redirect the user to
  // a different page BEFORE this useEffect can run. Thus reset(undefined, {})
  // technically never gets called in this particular case. Nonetheless, it's still
  // a good practice to implement it here. However, for toast notifications, it's
  // better to actually put them in the onSubmit.
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (status === 'success') {
      reset(undefined, {})
    }
  }, [status, reset])

  /* ======================
          return
  ====================== */

  return (
    <form
      className='mx-auto mb-6 max-w-lg overflow-hidden rounded-lg border border-neutral-500 bg-[#fafafa] p-4 shadow'
      onSubmit={(e) => {
        e.preventDefault()
      }}
      noValidate
    >
      <div className='mb-4'>
        <label htmlFor='userName' className='text-sm font-black text-blue-500'>
          User Name: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.userName
              ? ' is-invalid'
              : isSubmitted || touchedFields.userName
                ? ' is-valid'
                : ''
          }`}
          id='userName'
          placeholder='User Name...'
          spellCheck={false}
          type='text'
          {...register('userName')}
        />

        <div className='form-text text-xs'>
          This will be used as your public display name.
        </div>

        {errors.userName && (
          <div className='invalid-feedback'>{errors.userName?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='firstName' className='text-sm font-black text-blue-500'>
          First Name: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.firstName
              ? ' is-invalid'
              : isSubmitted || touchedFields.firstName
                ? ' is-valid'
                : ''
          }`}
          id='firstName'
          placeholder='First Name...'
          spellCheck={false}
          type='text'
          {...register('firstName')}
        />

        {errors.firstName && (
          <div className='invalid-feedback'>{errors.firstName?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='lastName' className='text-sm font-black text-blue-500'>
          Last Name: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.lastName
              ? ' is-invalid'
              : isSubmitted || touchedFields.lastName
                ? ' is-valid'
                : ''
          }`}
          id='lastName'
          placeholder='Last Name...'
          spellCheck={false}
          type='text'
          {...register('lastName')}
        />

        {errors.firstName && (
          <div className='invalid-feedback'>{errors.lastName?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label className='text-sm font-black text-blue-500' htmlFor='email'>
          Email: <sup className='text-red-500'>*</sup>
        </label>
        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.email
              ? ' is-invalid'
              : isSubmitted || touchedFields.email
                ? ' is-valid'
                : ''
          }`}
          id='email'
          placeholder='Email...'
          spellCheck={false}
          type='email'
          {...register('email')}
        />

        {errors.email && (
          <div className='invalid-feedback'>{errors.email?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label className='text-sm font-black text-blue-500' htmlFor='password'>
          Password: <sup className='text-red-500'>*</sup>
        </label>

        <div className='input-group'>
          <input
            autoComplete='off'
            className={`form-control form-control-sm${
              errors.password
                ? ' is-invalid'
                : isSubmitted || touchedFields.password
                  ? ' is-valid'
                  : ''
            }`}
            id='password'
            placeholder='Password...'
            spellCheck={false}
            type={passwordType}
            {...register('password')}
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

        {/* Because of the way that Bootstrap validation classes work, .*-feedback classes
        fail to inherit display:block when they are not direct siblings of the input. 
        In other words, the CSS breaks down when .input-group is used. In such cases, we
        need to assign them manually. */}
        {errors.password && (
          <div className={`invalid-feedback block`}>
            {errors.password?.message}
          </div>
        )}
      </div>

      <div className='mb-4'>
        <label
          className='text-sm font-black text-blue-500'
          htmlFor='confirmPassword'
        >
          Confirm Password: <sup className='text-red-500'>*</sup>
        </label>

        <div className='input-group'>
          <input
            autoComplete='off'
            className={`form-control form-control-sm${
              errors.confirmPassword
                ? ' is-invalid'
                : isSubmitted || touchedFields.confirmPassword
                  ? ' is-valid'
                  : ''
            }`}
            id='confirmPassword'
            placeholder='Confirm Password...'
            spellCheck={false}
            type={confirmPasswordType}
            {...register('confirmPassword')}
          />

          <button
            className='btm-sm btn-blue'
            type='button'
            onClick={() => {
              setConfirmPasswordType((previousValue) => {
                if (previousValue === 'password') {
                  return 'text'
                }
                return 'password'
              })
            }}
          >
            {confirmPasswordType === 'password' ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <div className={`invalid-feedback block`}>
            {errors.confirmPassword?.message}
          </div>
        )}
      </div>

      {status === 'pending' ? (
        <button className='btn-blue btn-sm mb-2 w-full' disabled type='button'>
          <span
            aria-hidden='true'
            className='spinner-border spinner-border-sm me-2'
            role='status'
          ></span>
          Registering...
        </button>
      ) : (
        <button
          className='btn-blue btn-sm mb-2 w-full'
          // The submit button is disabled here when there are errors, but
          // only when all fields have been touched. All fields will have
          // been touched either manually or after the first time the button
          // has been clicked.
          //
          // You could also add || !isDirty. In the case of an update form,
          // it still makes sense because there's no need to send an update if
          // nothing's actually been updated.
          disabled={isSubmitted && !isValid ? true : false}
          onClick={handleSubmit(onSubmit, onError)}
          type='button'
        >
          {isSubmitted && !isValid ? (
            <Fragment>
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                style={{ marginRight: 5 }}
              />{' '}
              Please Fix Errors...
            </Fragment>
          ) : (
            'Register'
          )}
        </button>
      )}
    </form>
  )
}

export { RegisterForm }
