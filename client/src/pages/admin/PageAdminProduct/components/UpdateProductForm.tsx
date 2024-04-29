import { Fragment, useState, useEffect, useRef } from 'react'
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler
  // Controller
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import { Button } from 'components'
import {
  adminUpdateProduct,
  adminSoftDeleteProduct,
  adminUploadImage
} from 'clientAPI'

import { sleep } from 'utils'
import { schema, FormValues } from './schema'

type UpdateProductFormProps = {
  product: Product
  onUpdated?: (updatedProduct?: Product | null) => void
  onDeleted?: (deletedProduct?: Product | null) => void
}

/* =============================================================================
                                UpdateProductForm 
============================================================================= */
//# We may want readonly fields for _id, createdAt, updatedAt, stripeProductId, stripePriceId.

//# We may want some UI for reviews, or a button that goes to the associated reviews
//# that button can also be on the Products list table.

export const UpdateProductForm = ({
  onUpdated,
  onDeleted,
  product
}: UpdateProductFormProps) => {
  const defaultValues: FormValues = {
    name: product.name || '',
    description: product.description || '',
    image: null,
    price: product.price.toString() || '',
    brand: product.brand || '',
    category: product.category || '',
    stock: product.stock.toString() || '',
    isActive: product.isActive || false
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

  const isActive = watch('isActive')

  /* ======================
        state & refs
  ====================== */

  const firstRenderRef = useRef(true)

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  const [deleteStatus, setDeleteStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  /* ======================
  handleSoftDeleteProduct()
  ====================== */
  // Note: Soft deleting a product is the same as setting it to isActive:false.
  // Thus, the logic for this feature is actually redundant with the checkbox field.

  const handleSoftDeleteProduct = async (productId: string) => {
    const confirmed = confirm('Are you sure you want to delete this product?')

    if (!confirmed) {
      return
    }

    setDeleteStatus('pending')

    adminSoftDeleteProduct(productId)
      .then(async (json) => {
        await sleep(1500)
        const { success, data: deletedProduct } = json

        if (success === true) {
          setDeleteStatus('success')
          onDeleted?.(deletedProduct) // Redirect to '/admin/products'
        } else {
          toast.error('Unable to soft delete product.')
          setDeleteStatus('error')
        }
        return json
      })

      // API function catches errors internally, so this should never happen.
      .catch((err) => {
        toast.error('Unable to soft delete product.')
        setDeleteStatus('error')
        return err
      })
  }

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
      brand,
      category,
      description,
      image,
      isActive,
      name,
      price,
      stock
    } = data

    setStatus('pending')

    try {
      await sleep(1500)

      // Make the request to upload the image FIRST
      let imageURL = ''

      // Again, because react-hook-form stores files in a FileList, we do this.
      if (image instanceof FileList && image?.[0] instanceof File) {
        const imageFile = image[0]
        const formData = new FormData()
        formData.append('image', imageFile)

        const imageUploadResponse = await adminUploadImage(formData)

        if (
          imageUploadResponse.success === true &&
          typeof imageUploadResponse.data === 'string'
        ) {
          imageURL = imageUploadResponse.data
          // If we had an image preview, then set the imageSrc state here.
        }
      }

      const requestData = {
        name,
        ...(imageURL ? { image: imageURL } : {}),
        description,
        price: Number(price), // Works for now.
        brand,
        category,
        stock: Number(stock), // Works for now.
        isActive: isActive
      }

      const json = await adminUpdateProduct(product._id, requestData)
      const { data: updatedProduct, success, errors } = json

      if (success === false) {
        setStatus('error')
        toast.error('Unable to update product.')

        if (errors && typeof errors === 'object') {
          if (errors?.name) {
            setError('name', {
              message: errors.name,
              type: 'custom'
            })
          }

          if (errors?.image) {
            setError('image', {
              message: errors.image,
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

          if (errors?.isActive) {
            setError('isActive', {
              message: errors.isActive,
              type: 'custom'
            })
          }
        }
      } else if (success === true) {
        setStatus('success')
        toast.success('Product updated!')
        onUpdated?.(updatedProduct)
      }

      return json

      // API function catches errors internally, so this should never happen.
    } catch (err) {
      setStatus('error')
      toast.error('Unable to update product.')
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
  // After successfully updating the product, onSuccess(updatedProduct) passes back the
  // updated product object to the consuming component, which in turn gets passed
  // back into this component through the product prop. Thus, when a new product prop
  // is detected, reset/update the form fields accordingly. This may seem kind of
  // redundant, but it's a best practice for ensuring that all state is using
  // the same source of truth.

  useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }

    reset({
      name: product.name || '',
      description: product.description || '',
      // image: null,
      price: product.price.toString() || '',
      brand: product.brand || '',
      category: product.category || '',
      stock: product.stock.toString() || '',
      isActive: product.isActive || false
    })
  }, [product, reset])

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
        <label htmlFor='name' className='text-sm font-black text-blue-500'>
          Name: <sup className='text-red-500'>*</sup>
        </label>

        <input
          autoComplete='off'
          className={`form-control form-control-sm${
            errors.name
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
        <label htmlFor='image' className='text-sm font-black text-blue-500'>
          Image:
        </label>

        <input
          //# Todo: add image preview logic to form.
          accept='image/png, image/jpeg, image/jpg'
          className={`form-control form-control-sm${
            errors.image
              ? ' is-invalid'
              : isSubmitted || touchedFields.image
                ? ' is-valid'
                : ''
          }`}
          id='image'
          type='file'
          {...register('image')}
        />

        {errors.image && (
          <div className='invalid-feedback'>{errors.image?.message}</div>
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
            errors.description
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
            errors.price
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
            errors.brand
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
            errors.category
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
            errors.stock
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

      {/* 
      No need to use Controller:

      <Controller
        control={control}
        name='isActive'
        render={({ field , fieldState, formState }) => {
          const { onBlur, onChange, ref, value, name, disabled } = field
          return (
            <div className='mb-4'>
              <div className='form-check'>
                <input
                  ref={ref}
                  checked={value}
                  className={`form-check-input${
                    errors.isActive
                      ? ' is-invalid'
                      : isSubmitted || touchedFields.isActive
                        ? ' is-valid'
                        : ''
                  }`}
                  disabled={disabled}
                  id='isActive'
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  // onChange={(e) => {
                  //   const checked = e.target.checked

                  //   ///////////////////////////////////////////////////////////////////////////
                  //   //
                  //   // Initially, I was not using Controller. Instead I tried to do this.
                  //   //
                  //   // onChange={(e) => {
                  //   //   const checked = e.target.checked
                  //   //   setValue('isActive', checked, {
                  //   //     shouldValidate: touchedFields.isActive === true ? true : false,
                  //   //     shouldDirty: true
                  //   //   })
                  //   // }}
                  //   //
                  //   // However, the checkbox wasn't updating correctly.
                  //   // With this onChange you pass in the new value directly.
                  //   // Unfortunately, that isn't immediately evident based on
                  //   // the type definition.
                  //   //
                  //   // However, this isn't even necessary. Somehow React Hook Form knows
                  //   // to use the true/false for the checkbox value.
                  //   //
                  //   ///////////////////////////////////////////////////////////////////////////
                  //   onChange(checked)
                  // }}

                  type='checkbox'
                />
                <label
                  className='form-check-label text-sm font-black leading-none text-blue-500'
                  htmlFor='isActive'
                >
                  {value === true ? 'Active' : 'Not Active'}
                </label>
              </div>

              {errors.isActive && (
                <div
                  className={`invalid-feedback block`}
                >
                  {errors.isActive?.message}
                </div>
              )}
            </div>
          )
        }}
      />
      */}

      <div className='mb-4'>
        <div className='form-check'>
          <input
            // Gotcha: This won't work because it doesn't trigger a rerender.
            // checked={getValues('isActive')}
            // Instead you have to watch the value
            checked={isActive}
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
            {isActive ? 'Active' : 'Not Active'}
          </label>
        </div>

        {errors.isActive && (
          <div className={`invalid-feedback block`}>
            {errors.isActive?.message}
          </div>
        )}
      </div>

      <div className='mb-2 flex flex-wrap gap-4'>
        <Button
          className='btn-red btn-sm flex-1'
          loading={deleteStatus === 'pending'}
          onClick={() => handleSoftDeleteProduct(product._id)}
          title='Set product to not active.'
          type='button'
        >
          {deleteStatus === 'pending' ? (
            'Deleting...'
          ) : (
            <>
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: 5 }} />{' '}
              Delete Product
            </>
          )}
        </Button>

        {status === 'pending' ? (
          <Button
            className='btn-blue btn-sm flex-1'
            type='button'
            loading={true}
          >
            Updating...
          </Button>
        ) : (
          <Button
            className='btn-blue btn-sm flex-1'
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
              'Update Product'
            )}
          </Button>
        )}
      </div>
    </form>
  )
}
