import { Dispatch, Fragment, useState, SetStateAction } from 'react'
import { toast } from 'react-toastify'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createProductReview } from '../createProductReview'
import { sleep } from 'utils'

type CreateReviewFormProps = {
  productId: string
  onSuccess?: () => void
}

/* =============================================================================
                                CreateProductReviewForm 
============================================================================= */

export const CreateProductReviewForm = ({
  productId,
  onSuccess
}: CreateReviewFormProps) => {
  /* ======================
        state & refs
  ====================== */

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  const [comment, setComment] = useState('')
  const [commentTouched, setCommentTouched] = useState(false)
  const [commentError, setCommentError] = useState('')

  const [rating, setRating] = useState('')
  const [ratingTouched, setRatingTouched] = useState(false)
  const [ratingError, setRatingError] = useState('')

  // Derived state - used to conditionally disable submit button
  const isErrors = commentError !== '' || ratingError !== ''
  const allTouched = commentTouched && ratingTouched

  /* ======================
      validateComment())
  ====================== */

  const validateComment = (value?: string) => {
    value = typeof value === 'string' ? value : comment
    let error = ''

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'Comment is required.'
      setCommentError(error)
      return error
    }

    setCommentError('')
    return ''
  }

  /* ======================
      validateRating()
  ====================== */
  //# rating validation needs to be more refined.
  //# We need to make sure it's a number, or can be coerced to a number
  //# Make sure it's between 0 and 5, etc.

  const validateRating = (value?: string) => {
    value = typeof value === 'string' ? value : rating
    let error = ''

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      error = 'Rating is required.'
      setRatingError(error)
      return error
    }

    setRatingError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: Dispatch<SetStateAction<boolean>>[] = [
      setCommentTouched,
      setRatingTouched
    ]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: (() => string)[] = [validateComment, validateRating]

    validators.forEach((validator) => {
      const error = validator()
      if (error) {
        errors.push(error)
      }
    })

    // Return early if errors
    if (errors.length >= 1) {
      toast.error('Form validation errors found.')
      return { isValid: false, errors: errors }
    }

    return { isValid: true, errors: null }
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    const { isValid } = validate()

    if (!isValid) {
      return
    }

    const requestData = {
      comment,
      rating: Number(rating) // Works for now.
    }

    setStatus('pending')

    createProductReview(productId, requestData)
      .then(async (json) => {
        await sleep(1500)

        const { /* data, */ success, errors } = json

        if (success === false) {
          setStatus('error')
          toast.error('Unable to create product review.')

          if (errors && typeof errors === 'object') {
            if (errors?.comment) {
              setCommentError(errors.comment)
            }

            if (errors?.rating) {
              setRatingError(errors.rating)
            }
          }
        } else if (success === true) {
          setStatus('success')

          setComment('')
          setRating('')

          toast.success('Product review created!')
          // This funcion would make a call for the product again, so that the review can
          // be shown in the product page.
          onSuccess?.()
        }

        return json
      })

      // createProduc() catches errors internally, so this should never happen.
      .catch((err) => {
        toast.error('Unable to create product.')
        return err
      })
  }

  /* ======================
          return
  ====================== */

  return (
    <form
      className='flex-1 overflow-hidden rounded-lg border border-neutral-500 bg-[#fafafa] p-4 shadow lg:self-start'
      onSubmit={(e) => {
        e.preventDefault()
      }}
      noValidate
    >
      <h3 className='font-black text-blue-500'>Create Review</h3>

      <div className='mb-4'>
        <label htmlFor='rating' className='text-sm font-black text-blue-500'>
          Rating: <sup className='text-red-500'>*</sup>
        </label>

        <select
          aria-label='Rating select'
          // className='form-select'
          className={`form-select form-select-sm${
            ratingError ? ' is-invalid' : ratingTouched ? ' is-valid' : ''
          }`}
          id='rating'
          name='rating'
          onBlur={(e) => {
            if (!ratingTouched) {
              setRatingTouched(true)
            }
            validateRating(e.target.value)
          }}
          onChange={(e) => {
            setRating(e.target.value)

            if (ratingTouched) {
              validateRating(e.target.value)
            }
          }}
          value={rating}
        >
          <option value=''>Rating...</option>
          <option value='0'>0</option>
          <option value='0.5'>0.5</option>
          <option value='1'>1</option>
          <option value='1.5'>1.5</option>
          <option value='2'>2</option>
          <option value='2.5'>2.5</option>
          <option value='3'>3</option>
          <option value='3.5'>3.5</option>
          <option value='4'>4</option>
          <option value='4.5'>4.5</option>
          <option value='5'>5</option>
        </select>

        <div className='invalid-feedback'>{ratingError}</div>
      </div>
      <div className='mb-4'>
        <label htmlFor='comment' className='text-sm font-black text-blue-500'>
          Comment: <sup className='text-red-500'>*</sup>
        </label>

        <textarea
          autoComplete='off'
          className={`form-control form-control-sm${
            commentError ? ' is-invalid' : commentTouched ? ' is-valid' : ''
          }`}
          style={{ minHeight: 200 }}
          id='comment'
          name='comment'
          onBlur={(e) => {
            if (!commentTouched) {
              setCommentTouched(true)
            }
            validateComment(e.target.value)
          }}
          onChange={(e) => {
            setComment(e.target.value)

            if (commentTouched) {
              validateComment(e.target.value)
            }
          }}
          placeholder='Comment...'
          spellCheck={false}
          value={comment}
        />

        <div className='invalid-feedback'>{commentError}</div>
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
          disabled={allTouched && isErrors ? true : false}
          onClick={handleSubmit}
          type='button'
        >
          {allTouched && isErrors ? (
            <Fragment>
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                style={{ marginRight: 5 }}
              />{' '}
              Please Fix Errors...
            </Fragment>
          ) : (
            'Create Review'
          )}
        </button>
      )}
    </form>
  )
}
