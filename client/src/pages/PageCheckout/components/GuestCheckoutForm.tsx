// Third-party imports
import { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons' // https://github.com/FortAwesome/react-fontawesome

// Custom imports
import { sleep } from 'utils'
import { Button } from 'components'
import { useCartContext } from 'contexts'
import { createOrUpdateOrder } from 'clientAPI/createOrUpdateOrder'
import { schema, FormValues, defaultValues } from './schema'

/* =============================================================================
                                  GuestCheckoutForm  
============================================================================= */
// The GuestCheckoutForm is very similar to the normal CheckoutForm.
// However, it does not preload form fields.
// Nor does it setCurrentOrder() after an order is created and before redirecting.

export const GuestCheckoutForm = () => {
  const navigate = useNavigate()
  const { cartItems } = useCartContext()

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    // trigger,
    // watch,
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
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country
    } = data

    const customer = { firstName, lastName, email, phone }
    const shipping = { address, city, state, postalCode, country }

    setStatus('pending')

    try {
      await sleep(1500) // Demo only

      const json = await createOrUpdateOrder({
        cartItems,
        customer: customer,
        shipping: shipping
      })

      const { data: order, success, errors } = json

      if (success === true && order && typeof order === 'object') {
        setStatus('success')

        const orderId = order._id

        if (orderId && typeof orderId === 'string') {
          navigate(`/orders/${orderId}`)
        }
      } else if (success === false) {
        //# Currently, the createOrUpdate controller is not sending back data as errors.
        //# Update it to validate everything and potentially send back field errors.
        setStatus('error')
        toast.error('Unable to complete checkout process.')

        if (errors && typeof errors === 'object') {
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
        }
      }

      return json
      // API function catches errors internally, so this should never happen.
    } catch (err) {
      setStatus('error')
      toast.error('Unable to complete checkout process.')
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
      <fieldset className='mb-4'>
        <legend className='mb-2 text-center text-xl font-black text-blue-500'>
          Customer Information
        </legend>

        <div className='mb-4'>
          <label
            htmlFor='firstName'
            className='text-sm font-black text-blue-500'
          >
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
          <label
            htmlFor='lastName'
            className='text-sm font-black text-blue-500'
          >
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
      </fieldset>

      <fieldset className='mb-4'>
        <legend className='mb-2 text-center text-xl font-black text-blue-500'>
          Shipping Address
        </legend>

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
      </fieldset>

      {status === 'pending' ? (
        <Button
          className='btn-blue btn-sm mb-2 w-full'
          loading={true}
          type='button'
        >
          Creating Order...
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
            'Proceed To Order Summary'
          )}
        </Button>
      )}
    </form>
  )
}
