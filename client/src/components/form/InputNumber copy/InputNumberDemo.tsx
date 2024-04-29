// Third-party imports
import { Fragment, useEffect, useState } from 'react'
import {
  useForm,
  SubmitHandler,
  SubmitErrorHandler,
  Controller
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

// Custom imports
import { sleep } from 'utils'
import { InputNumber } from './'

const schema = z.object({
  number: z.string()
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  number: '10'
}

/* ========================================================================
                                InputNumberDemo
======================================================================== */

export const InputNumberDemo = () => {
  const [controlledValue, setControlledValue] = useState('')

  const {
    // register,
    reset,
    handleSubmit,
    getValues,
    // trigger,
    watch,
    control,
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

  // const { onChange, ...otherRegisterProps } = register('number')

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
    const values = getValues()
    console.log({ values, errors })
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
        useEffect()
  ====================== */

  ///////////////////////////////////////////////////////////////////////////
  //
  // watch alternative:
  //
  //   onChange={(e) => {
  //     onChange(e)
  //     console.log('number:', e.target.value)
  //   }}
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const subscription = watch((values) => {
      console.log('watched number:', values.number)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    console.log('controlledValue:', controlledValue)
  }, [controlledValue])

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

          <Controller
            control={control}
            name='number'
            render={({ field }) => {
              const { onChange, onBlur, value, ref, disabled } = field

              // console.log({ 'field.value': value })
              return (
                <InputNumber
                  ///////////////////////////////////////////////////////////////////////////
                  //
                  // In practice, you could do this:
                  //
                  //   const [controlledValue, setControlledValue] = useState('')
                  //
                  //   ...
                  //
                  //   onChange={(e) => {
                  //     setControlledValue(e.target.value)
                  //     onChange(e)
                  //   }}
                  //   value={controlledValue}
                  //
                  // However, if you're using react-hook-form, then that's kind of redundant.
                  // Instead, the Controller handles all of that for you, and your state
                  // is managed by react-hook-form already.
                  //
                  // That said, I'm doing it here for testing purposes.
                  //
                  ///////////////////////////////////////////////////////////////////////////
                  // onChange={onChange}
                  // value={value}

                  onChange={(e) => {
                    setControlledValue(e.target.value)
                    onChange(e)
                  }}
                  value={controlledValue}
                  onBlur={onBlur}
                  ref={ref}
                  disabled={disabled}
                  // allowNegative={false}
                  // allowDecimal={false}
                  //decimalScale={2}
                  //fixedDecimalScale
                  thousandSeparator=','
                  // defaultValue='101'
                  // clampBehavior='strict'
                  className=''
                  error={errors?.number?.message}
                  formGroupClassName='mb-4'
                  formGroupStyle={{}}
                  formText=''
                  formTextClassName=''
                  formTextStyle={{}}
                  id='number'
                  label='number:'
                  labelClassName=''
                  labelRequired
                  labelStyle={{}}
                  placeholder='Number...'
                  size='sm'
                  style={{}}
                  touched={touchedFields?.number}
                  min={-1}
                  max={101}
                />
              )
            }}
          />

          {/* <InputNumber
            // allowNegative={false}
            // allowDecimal={false}
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator=','
            // defaultValue='101'
            // clampBehavior='strict'
            className=''
            error={errors?.number?.message}
            formGroupClassName='mb-4'
            formGroupStyle={{}}
            formText=''
            formTextClassName=''
            formTextStyle={{}}
            id='number'
            label='number:'
            labelClassName=''
            labelRequired
            labelStyle={{}}
            placeholder='Number...'
            size='sm'
            style={{}}
            touched={touchedFields?.number}
            min={-1}
            max={101}
            // {...register('number')}
            onChange={(e) => {
              onChange(e)
              console.log('number:', e.target.value)
            }}
            {...otherRegisterProps}
          /> */}

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
