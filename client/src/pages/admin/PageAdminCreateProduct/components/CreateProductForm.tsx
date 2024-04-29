import { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler
  // Controller
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { adminCreateProduct } from 'clientAPI/adminCreateProduct'
import { sleep } from 'utils'
import { schema, FormValues, defaultValues } from './schema'

/* =============================================================================
                                CreateProductForm 
============================================================================= */

export const CreateProductForm = () => {
  const navigate = useNavigate()

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
    // control,
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
    const { brand, category, description, name, price, stock } = data

    const requestData = {
      name,
      description,
      price: Number(price), // Works for now.
      brand,
      category,
      stock: Number(stock) // Works for now.
    }

    setStatus('pending')

    try {
      await sleep(1500)
      const json = await adminCreateProduct(requestData)
      const { data: createdProduct, success, errors } = json

      if (success === false) {
        setStatus('error')
        toast.error('Unable to create product.')

        if (errors && typeof errors === 'object') {
          if (errors?.name) {
            setError('name', {
              message: errors.name,
              type: 'custom'
            })
          }

          if (errors?.description) {
            setError('description', {
              message: errors.description,
              type: 'custom'
            })
          }

          if (errors?.price) {
            setError('price', {
              message: errors.price,
              type: 'custom'
            })
          }

          if (errors?.brand) {
            setError('brand', {
              message: errors.brand,
              type: 'custom'
            })
          }

          if (errors?.category) {
            setError('category', {
              message: errors.category,
              type: 'custom'
            })
          }

          if (errors?.stock) {
            setError('stock', {
              message: errors.stock,
              type: 'custom'
            })
          }
        }
      } else if (success === true) {
        setStatus('success')
        toast.success('Product created!')

        if (createdProduct?._id && typeof createdProduct._id === 'string') {
          navigate(`/admin/products/${createdProduct._id}`)
        }
      }

      return json

      // API function catches errors internally, so this should never happen.
    } catch (err) {
      setStatus('error')
      toast.error('Unable to create product.')
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
      <div className='mb-4'>
        <label htmlFor='name' className='text-sm font-black text-blue-500'>
          Name: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.name?.message
              ? ' is-invalid'
              : isSubmitted || touchedFields.name
                ? ' is-valid'
                : ''
          }`}
          id='name'
          placeholder='Name...'
          spellCheck={false}
          type='text'
          {...register('name')}
        />

        {errors.name && (
          <div className='invalid-feedback'>{errors.name?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label
          htmlFor='description'
          className='text-sm font-black text-blue-500'
        >
          Description: <sup className='text-red-500'>*</sup>
        </label>

        <textarea
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.description?.message
              ? ' is-invalid'
              : isSubmitted || touchedFields.description
                ? ' is-valid'
                : ''
          }`}
          id='description'
          placeholder='Description...'
          spellCheck={false}
          {...register('description')}
        />

        {errors.description && (
          <div className='invalid-feedback'>{errors.description?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='price' className='text-sm font-black text-blue-500'>
          Price: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.price?.message
              ? ' is-invalid'
              : isSubmitted || touchedFields.price
                ? ' is-valid'
                : ''
          }`}
          id='price'
          placeholder='Price...'
          spellCheck={false}
          min={0}
          type='number'
          {...register('price')}
        />

        {errors.price && (
          <div className='invalid-feedback'>{errors.price?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='brand' className='text-sm font-black text-blue-500'>
          Brand: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.brand?.message
              ? ' is-invalid'
              : isSubmitted || touchedFields.brand
                ? ' is-valid'
                : ''
          }`}
          id='brand'
          placeholder='Brand...'
          spellCheck={false}
          type='text'
          {...register('brand')}
        />

        {errors.brand && (
          <div className='invalid-feedback'>{errors.brand?.message}</div>
        )}
      </div>

      {/* 
      //# Needs to be a <select>
      //# Ultimately, this would probably be database-driven.
      */}
      <div className='mb-4'>
        <label htmlFor='category' className='text-sm font-black text-blue-500'>
          Category: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.category?.message
              ? ' is-invalid'
              : isSubmitted || touchedFields.category
                ? ' is-valid'
                : ''
          }`}
          id='category'
          placeholder='Category...'
          spellCheck={false}
          type='text'
          {...register('category')}
        />

        {errors.category && (
          <div className='invalid-feedback'>{errors.category?.message}</div>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='stock' className='text-sm font-black text-blue-500'>
          Stock: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.stock?.message
              ? ' is-invalid'
              : isSubmitted || touchedFields.stock
                ? ' is-valid'
                : ''
          }`}
          id='stock'
          placeholder='Stock...'
          spellCheck={false}
          type='number'
          {...register('stock')}
        />

        {errors.stock && (
          <div className='invalid-feedback'>{errors.stock?.message}</div>
        )}
      </div>

      {status === 'pending' ? (
        <button className='btn-blue btn-sm mb-2 w-full' disabled type='button'>
          <span
            aria-hidden='true'
            className='spinner-border spinner-border-sm me-2'
            role='status'
          ></span>
          Creating...
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
            'Create Product'
          )}
        </button>
      )}
    </form>
  )
}
