import { Fragment, useState, useRef, useEffect } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from 'components'
import { sleep } from 'utils'
import { adminUpdateUser } from 'clientAPI/adminUpdateUser'
import { schema, FormValues } from './schema'

type UpdateUserFormProps = {
  user: User
  onUpdated?: (updatedUser?: User | null) => void
}

/* =============================================================================
                                UpdateUserForm 
============================================================================= */
// Unlike the user's form to update themselves, here the ability for an admin to update the image has been omitted.
//# We may want readonly fields for _id, createdAt, updatedAt, etc.

export const UpdateUserForm = ({ user, onUpdated }: UpdateUserFormProps) => {
  const defaultValues: FormValues = {
    userName: user.userName || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.shipping?.address || '',
    city: user.shipping?.city || '',
    state: user.shipping?.state || '',
    postalCode: user.shipping?.postalCode || '',
    country: user.shipping?.country || '',
    isActive: user.isActive || false,
    roles: user.roles || ['user']
  }

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    // trigger,
    watch,
    setValue,
    // resetField,
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
    // This only happens on initialization, so even if you pass in a new user
    // it won't change the defaultValues.
    defaultValues: defaultValues,

    // Do NOT use mode: 'all'. Instead use mode: 'onTouched'.
    // This will validate onBlur. Then will subsequently, validate onChange.
    // It will also validate onSubmit.
    // The reason this is important is because the form field components
    // are designed to ALWAYS SHOW Error if there is an error.
    mode: 'onTouched',
    resolver: zodResolver(schema)
  })

  const isActiveValue = watch('isActive')
  const { onChange: rolesOnChange, ...otherRolesProps } = register('roles')

  /* ======================
        state & refs
  ====================== */

  const firstRenderRef = useRef(true)

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

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
    const {
      userName,
      firstName,
      lastName,
      email,
      phone,
      roles,
      isActive,
      address,
      city,
      state,
      postalCode,
      country
    } = data

    const shipping = {
      address,
      city,
      state,
      postalCode,
      country
    }

    const requestData = {
      userName,
      firstName,
      lastName,
      email,
      phone,
      roles,
      isActive,
      shipping
    }

    setStatus('pending')

    try {
      await sleep(1500) // Demo only

      const json = await adminUpdateUser(user._id, requestData)
      const { success, errors, data: updatedUser } = json

      if (success === false) {
        setStatus('error')
        toast.error('Unable to update user.')

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

          if (errors?.phone) {
            setError('phone', {
              message: errors.phone,
              type: 'custom'
            })
          }

          if (errors?.address) {
            setError('address', {
              message: errors.address,
              type: 'custom'
            })
          }

          if (errors?.city) {
            setError('city', {
              message: errors.city,
              type: 'custom'
            })
          }

          if (errors?.state) {
            setError('state', {
              message: errors.state,
              type: 'custom'
            })
          }

          if (errors?.postalCode) {
            setError('postalCode', {
              message: errors.postalCode,
              type: 'custom'
            })
          }

          if (errors?.country) {
            setError('country', {
              message: errors.country,
              type: 'custom'
            })
          }

          if (errors?.isActive) {
            setError('isActive', {
              message: errors.isActive,
              type: 'custom'
            })
          }

          if (errors?.roles) {
            setError('roles', {
              message: errors.roles,
              type: 'custom'
            })
          }
        }
      } else if (success === true) {
        setStatus('success')
        toast.success('User updated!')
        onUpdated?.(updatedUser)
      }
      return json

      // API function catches errors internally, so this should never happen.
    } catch (err) {
      setStatus('error')
      toast.error('Unable to update user.')
      return err
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
  // After successfully updating the user, onSuccess(updatedUser) passes back the
  // updated user object to the consuming component, which in turn gets passed
  // back into this component through the user prop. Thus, when a new user prop
  // is detected, reset/update the form fields accordingly. This may seem kind of
  // redundant, but it's a best practice for ensuring that all state is using
  // the same source of truth.

  useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }

    reset({
      userName: user.userName || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.shipping?.address || '',
      city: user.shipping?.city || '',
      state: user.shipping?.state || '',
      postalCode: user.shipping?.postalCode || '',
      country: user.shipping?.country || '',
      isActive: user.isActive || false,
      roles: user.roles || ['user']
    })
  }, [user, reset])

  /* ======================
          return
  ====================== */

  return (
    <form
      className='mx-auto mb-6 max-w-3xl overflow-hidden rounded-lg border border-neutral-500 bg-[#fafafa] p-4 shadow'
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
        <label className='text-sm font-black text-blue-500' htmlFor='phone'>
          Phone: <sup className='text-red-500'>*</sup>
        </label>
        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.phone
              ? ' is-invalid'
              : isSubmitted || touchedFields.phone
                ? ' is-valid'
                : ''
          }`}
          id='phone'
          placeholder='Phone...'
          spellCheck={false}
          type='text'
          {...register('phone')}
        />

        {errors.phone && (
          <div className='invalid-feedback'>{errors.phone?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='address' className='text-sm font-black text-blue-500'>
          Address: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.address
              ? ' is-invalid'
              : isSubmitted || touchedFields.address
                ? ' is-valid'
                : ''
          }`}
          id='address'
          placeholder='Address...'
          spellCheck={false}
          type='text'
          {...register('address')}
        />

        {errors.address && (
          <div className='invalid-feedback'>{errors.address?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='city' className='text-sm font-black text-blue-500'>
          City: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.city
              ? ' is-invalid'
              : isSubmitted || touchedFields.city
                ? ' is-valid'
                : ''
          }`}
          id='city'
          placeholder='City...'
          spellCheck={false}
          type='text'
          {...register('city')}
        />

        {errors.city && (
          <div className='invalid-feedback'>{errors.city?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='state' className='text-sm font-black text-blue-500'>
          State: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.state
              ? ' is-invalid'
              : isSubmitted || touchedFields.state
                ? ' is-valid'
                : ''
          }`}
          id='state'
          placeholder='State...'
          spellCheck={false}
          type='text'
          {...register('state')}
        />

        {errors.state && (
          <div className='invalid-feedback'>{errors.state?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label
          htmlFor='postalCode'
          className='text-sm font-black text-blue-500'
        >
          Postal Code: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.postalCode
              ? ' is-invalid'
              : isSubmitted || touchedFields.postalCode
                ? ' is-valid'
                : ''
          }`}
          id='postalCode'
          placeholder='Postal Code...'
          spellCheck={false}
          type='text'
          {...register('postalCode')}
        />

        {errors.postalCode && (
          <div className='invalid-feedback'>{errors.postalCode?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='country' className='text-sm font-black text-blue-500'>
          Country: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.country
              ? ' is-invalid'
              : isSubmitted || touchedFields.country
                ? ' is-valid'
                : ''
          }`}
          id='country'
          placeholder='Country...'
          spellCheck={false}
          type='text'
          {...register('country')}
        />

        {errors.country && (
          <div className='invalid-feedback'>{errors.country?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <div className='form-check'>
          <input
            // Gotcha: This won't work because it doesn't trigger a rerender.
            // checked={getValues('isActive')}
            // Instead you have to watch the value
            checked={isActiveValue}
            className={`form-check-input${
              errors.isActive
                ? ' is-invalid'
                : isSubmitted || touchedFields.isActive
                  ? ' is-valid'
                  : ''
            }`}
            id='isActive'
            type='checkbox'
            ///////////////////////////////////////////////////////////////////////////
            //
            // There's no need to do anything special for the onChange so that
            // react-hook-form will use e.target.checked. For a checkbox input,
            // React Hook Form knows to use the e.target.checked property instead of
            // e.target.value because checkboxes represent a boolean value (checked or unchecked)
            // rather than a string value like a text input.
            //
            // When you use {...register('isActive')} on the checkbox input, React Hook Form sets up the
            // necessary event handlers and value management for you. It listens for the onChange event
            // and updates the form state accordingly, using e.target.checked to get the checkbox's value.
            //
            ///////////////////////////////////////////////////////////////////////////
            {...register('isActive')}
          />
          <label
            className='form-check-label text-sm font-black leading-none text-blue-500'
            htmlFor='isActive'
          >
            {isActiveValue ? 'Active' : 'Not Active'}
          </label>
        </div>

        {errors.isActive && (
          <div className={`invalid-feedback block`}>
            {errors.isActive?.message}
          </div>
        )}
      </div>

      <fieldset className='mb-4' onChange={rolesOnChange}>
        <legend className='mb-0 text-sm font-black text-blue-500'>
          Select A Role: <sup className='text-red-500'>*</sup>
        </legend>

        {/* This is a quasi-disabled implementation. Because of the way we've implemented and
        registered roles, it's not possible to set disabled through react-hook-form. We want
        to show the user role, but also only allow it to be read only*/}
        <div className='form-check opacity-65'>
          <input
            className={`form-check-input pointer-events-none${
              errors.roles
                ? ' is-invalid'
                : isSubmitted || touchedFields.roles
                  ? ' is-valid'
                  : ''
            }`}
            id='role-1'
            onKeyDown={(e) => {
              if (e.key !== 'Tab') {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            type='checkbox'
            value='user'
            {...otherRolesProps}
          />
          <label
            className='form-check-label pointer-events-none text-sm font-bold leading-none text-blue-500'
            htmlFor='role-1'
          >
            User
          </label>
        </div>

        <div className='form-check'>
          <input
            className={`form-check-input${
              errors.roles
                ? ' is-invalid'
                : isSubmitted || touchedFields.roles
                  ? ' is-valid'
                  : ''
            }`}
            id='role-2'
            type='checkbox'
            value='manager'
            {...otherRolesProps}
          />
          <label
            className='form-check-label text-sm font-bold leading-none text-blue-500'
            htmlFor='role-2'
          >
            Manager
          </label>
        </div>

        <div className='form-check'>
          <input
            className={`form-check-input${
              errors.roles
                ? ' is-invalid'
                : isSubmitted || touchedFields.roles
                  ? ' is-valid'
                  : ''
            }`}
            id='role-3'
            type='checkbox'
            value='admin'
            {...otherRolesProps}
          />
          <label
            className='form-check-label text-sm font-bold leading-none text-blue-500'
            htmlFor='role-3'
          >
            Administrator
          </label>
        </div>

        {errors.roles && (
          <div className={`invalid-feedback block`}>
            {errors.roles?.message}
          </div>
        )}
      </fieldset>

      {status === 'pending' ? (
        <Button
          className='btn-blue btn-sm mb-2 w-full'
          disabled
          loading={true}
          type='button'
        >
          Updating...
        </Button>
      ) : (
        <Button
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
            'Update User'
          )}
        </Button>
      )}
    </form>
  )
}
