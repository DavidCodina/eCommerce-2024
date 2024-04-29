import { ComponentProps } from 'react'

type Options = ReadonlyArray<{ readonly title: string; readonly value: string }>

type CatetoryFilterProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  options: Options
  value: string[]
} & Omit<ComponentProps<'div'>, 'onChange'>

/* ========================================================================
                              CategoryFilter       
======================================================================== */

export const CategoryFilter = ({
  value,
  onChange,
  options,
  ...otherProps
}: CatetoryFilterProps) => {
  /* ======================
      renderOptions()
  ====================== */

  const renderOptions = () => {
    return options.map((option, index) => {
      return (
        <div key={option.value} className='flex items-center gap-2'>
          <input
            type='checkbox'
            className='form-check-input m-0'
            id={`cateogryFilter${index}`}
            value={option.value}
            onChange={onChange}
            checked={value.includes(option.value)}
          />

          <label className='text-sm' htmlFor={`categoryFilter${index}`}>
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
      {/* <h3 className='text-lg font-black text-blue-500'>Category:</h3> */}
      <div className='space-y-2 text-xl'>{renderOptions()}</div>
    </div>
  )
}
