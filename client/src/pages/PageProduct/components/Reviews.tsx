import { Rating } from 'components/Rating'

type ReviewsProps = {
  reviews: Record<string, any>[]
}
/* =============================================================================
                                Reviews
============================================================================= */
// Obviously, showin all reviews can get unwieldy.
// Ultimately, we want to have a reviews page that shows all reviews in a paginated list.
// This component is only intended to show a limited number of reviews.

export const Reviews = ({ reviews = [] }: ReviewsProps) => {
  const renderReviews = () => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return null
    }

    return (
      <div
        className='overflow-auto rounded-xl border border-neutral-800 bg-white p-4 lg:flex-[2_2_0%]'
        // style={{ maxHeight: 400 }}
      >
        <h3 className='font-black text-blue-500'>Reviews</h3>

        {reviews.map((review) => {
          const formattedCreatedAt = new Date(
            review.createdAt
          ).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })

          return (
            <div className='mb-6' key={review._id}>
              <Rating
                defaultValue={review.rating}
                size='24px'
                spacing='4px'
                defaultColor='var(--tw-neutral-300)'
                activeColor='var(--tw-yellow-500)'
                readOnly={true}
                showTitle={true}
              />

              <p className='mb-4 text-sm'>{review.comment}</p>

              <p className='text-xs'>
                Posted on {formattedCreatedAt} by{' '}
                <span className='font-bold'>{review.userName}</span>
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  return renderReviews()
}
