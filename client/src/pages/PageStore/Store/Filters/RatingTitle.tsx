import { Rating } from 'components/Rating'

/* ========================================================================
                                RatingTitle        
======================================================================== */

export const RatingTitle = ({
  value,
  plus
}: {
  value: number
  plus?: boolean
}) => {
  return (
    <div className='flex max-h-[16px] -translate-y-[15%] items-center'>
      <Rating
        defaultValue={value}
        size='20px'
        spacing='0px'
        // defaultColor='transparent'
        count={value}
        activeColor='var(--tw-yellow-500)'
        readOnly={true}
      />
      {plus && <span className='ml-1 text-lg font-bold text-blue-500'>+</span>}
    </div>
  )
}
