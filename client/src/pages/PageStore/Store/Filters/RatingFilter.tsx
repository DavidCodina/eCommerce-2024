import { ReactNode, ComponentProps } from 'react'

type Options = ReadonlyArray<{
  readonly title: ReactNode
  readonly value: string
}>

type RatingFilterProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  options: Options
  value: string
} & Omit<ComponentProps<'div'>, 'onChange'>

/* ========================================================================
                              RatingFilter
======================================================================== */

export const RatingFilter = ({
  onChange,
  options,
  value,
  ...otherProps
}: RatingFilterProps) => {
  /* ======================
      renderOptions()
  ====================== */

  const renderOptions = () => {
    return options.map((option, index) => {
      // Assuming options includes  { title: 'All', value: '' } and the controlled value is
      // initialized to '', then the 'All' option will be checked initially.
      return (
        <div key={option.value} className='flex items-center gap-2 '>
          <input
            type='radio'
            className='form-check-input m-0'
            id={`ratingFilter${index}`}
            value={option.value}
            onChange={onChange}
            name='ratingFilterRadioGroup'
            checked={value === option.value}
          />

          <label className='text-sm' htmlFor={`ratingFilter${index}`}>
            {option.title}
          </label>
        </div>
      )
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <div {...otherProps}>
      {/* <h3 className='text-lg font-black text-blue-500'>Rating:</h3> */}
      <div className='space-y-2 text-xl'>{renderOptions()}</div>
    </div>
  )
}
