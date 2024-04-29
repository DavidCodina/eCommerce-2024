import { ComponentProps } from 'react'

type Options = ReadonlyArray<{ readonly title: string; readonly value: string }>

type PriceFilterProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  options: Options
  value: string
} & Omit<ComponentProps<'div'>, 'onChange'>

/* ========================================================================
                              PriceFilter
======================================================================== */
// Could Do: Implement two-sided range slider in the Filters/Rating section.
// See the Josh Tried Coding tutorial at 2:06:00 - 2:16:00.

export const PriceFilter = ({
  onChange,
  options,
  value,
  ...otherProps
}: PriceFilterProps) => {
  /* ======================
      renderOptions()
  ====================== */

  const renderOptions = () => {
    return options.map((option, index) => {
      // Assuming options includes  { title: 'All', value: '' } and the controlled value is
      // initialized to '', then the 'All' option will be checked initially.
      return (
        <div key={option.value} className='flex items-center gap-2'>
          <input
            type='radio'
            className='form-check-input m-0'
            id={`priceFilter${index}`}
            value={option.value}
            onChange={onChange}
            name='priceFilterRadioGroup'
            checked={value === option.value}
          />

          <label className='text-sm' htmlFor={`priceFilter${index}`}>
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
      {/* <h3 className='text-lg font-black text-blue-500'>Price:</h3> */}
      <div className='space-y-2 text-xl'>{renderOptions()}</div>
    </div>
  )
}
