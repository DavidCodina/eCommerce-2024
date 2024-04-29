// Third-party imports
import { Fragment, useEffect } from 'react'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

// Custom imports
import { sleep } from 'utils'
import { InputPassword } from './'

const schema = z
  .object({
    password: z.string().min(5, 'Must be at least 5 characters.'),
    // .nonempty('Required.') is still important to prevent false
    // positives when both password and confirm password are empty.
    // However, it's now deprecated, so do this instead.
    confirmPassword: z.string().min(1, 'Required.')
  })
  ///////////////////////////////////////////////////////////////////////////
  //
  // This will validate confirmPassword against password.
  // However, in order to sync confirmPassword validation
  // with changes to password, we need to implement useEffct:
  //
  //   const password = watch('password')
  //   useEffect(() => { trigger('confirmPassword') }, [password, trigger])
  //
  ///////////////////////////////////////////////////////////////////////////
  .refine(
    (data) => {
      const isValid = data.password === data.confirmPassword
      return isValid
    },
    {
      message: 'The passwords must match.',
      path: ['confirmPassword']
    }
  )

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  password: '',
  confirmPassword: ''
}

/* ========================================================================

======================================================================== */

export const InputPasswordDemo = () => {
  const {
    register,
    reset,
    handleSubmit,
    trigger,
    watch,
    formState: {
      errors,
      isValid,
      touchedFields,
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful
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
        onSubmit()
  ====================== */

  const onSubmit: SubmitHandler<FormValues> = async (data, _e) => {
    console.log('onSubmit called.', data)
    await sleep(1000) // await API call
  }

  /* ======================
        onError()
  ====================== */

  const onError: SubmitErrorHandler<FormValues> = (errors, _e) => {
    console.log({ errors })
    // toast.error('Please correct form validation errors!')
  }

  /* ======================
        useEffect()
  ====================== */
  // It's recommended to NOT call reset() from within the onSubmit() function.

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      reset(undefined, {})
      toast.success('Form validation success!')
    }

    // We need isSubmitted as well because isSubmitSuccessful will be false by default.
    else if (isSubmitted && !isSubmitSuccessful) {
      toast.error('Unable to submit the form!')
    }
  }, [isSubmitted, isSubmitSuccessful, reset])

  /* ======================
        renderForm()
  ====================== */

  const renderForm = () => {
    return (
      <Fragment>
        <form
          className='mx-auto mb-6 rounded-lg border border-neutral-400 p-4 shadow'
          style={{ backgroundColor: '#fafafa', maxWidth: 800 }}
          onSubmit={(e) => {
            e.preventDefault()
          }}
          noValidate // Not really needed, but doesn't hurt.
        >
          {/* =====================
       
          ===================== */}

          <InputPassword
            error={errors?.password?.message}
            formGroupClassName='mb-4'
            id='password'
            label='Password'
            labelRequired
            placeholder='Password...'
            size='sm'
            touched={touchedFields?.password}
            {...register('password')}
          />

          <InputPassword
            error={errors?.confirmPassword?.message}
            formGroupClassName='mb-4'
            id='confirm-password'
            label='Confirm Password'
            labelRequired
            placeholder='Confirm Password...'
            size='sm'
            touched={touchedFields?.confirmPassword}
            {...register('confirmPassword')}
          />

          {/* =====================
                Submit Button
          ===================== */}

          {isSubmitting ? (
            <button
              className='btn-green btn-sm block w-full'
              disabled
              type='button'
            >
              <span
                aria-hidden='true'
                className='spinner-border spinner-border-sm mr-2'
                role='status'
              ></span>
              Submitting...
            </button>
          ) : (
            <button
              className='btn-green btn-sm block w-full'
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
                'Submit'
              )}
            </button>
          )}
        </form>
      </Fragment>
    )
  }

  /* ======================
          return 
  ====================== */

  return renderForm()
}
