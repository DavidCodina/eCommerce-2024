import { useState, useEffect } from 'react'

type Options = ReadonlyArray<{ readonly title: string; readonly value: string }>

type BrandFilterProps = {
  onChange: (value: string[]) => void
  options: Options
}

const allProductsValue = ''

const check = (
  <svg width='1.25em' height='1.25em' fill='currentColor' viewBox='0 0 16 16'>
    <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
    <path d='m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05' />
  </svg>
)

/* ========================================================================
                              BrandFilter   
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// BrandFilter is largely redundant because you can just add it to the
// Sidebar instead as the 'Brand' section, but it shows another way of handling filters.
// Also the handleClick() logic has some unique behavior.
//
// Usage:
//
// export const brandOptions = [
//   { title: 'All Brands', value: '' },
//   { title: 'Sony', value: 'sony' },
//   { title: 'Samsung', value: 'samsung' },
//   { title: 'Cannon', value: 'cannon' },
//   { title: 'LG', value: 'lg' },
//   { title: 'Nintendo', value: 'nintendo' },
//   { title: 'Microsoft', value: 'microsoft' },
//   { title: 'Google', value: 'google' },
//   { title: 'Toshiba', value: 'toshiba' },
//   { title: 'Apple', value: 'apple' }
// ] as const
//
//   if (brands.length > 0) {
//     filteredProducts = filteredProducts.filter((p) => {
//       return brands.includes(p.company.toLowerCase())
//     })
//   }
//
//
//   <BrandFilter
//     onChange={(value) => { setBrands(value) }}
//     options={brandOptions}
//   />
//
///////////////////////////////////////////////////////////////////////////

export const BrandFilter = ({ onChange, options }: BrandFilterProps) => {
  const [selected, setSelected] = useState<string[]>([])
  const optionsLength = options.length

  /* ======================
       handleClick()
  ====================== */

  const handleClick = (value: string) => {
    const isAllProductsValue = value === allProductsValue

    setSelected((prevSelected) => {
      // Remove value if it's previously been selected.
      if (prevSelected.includes(value)) {
        // If the value being removed is allProductsValue and EVERYTHING is
        // currently selected, then deselect everything.

        if (isAllProductsValue && prevSelected.length === optionsLength) {
          return []
        }

        // Otherwise, filter out the value to deselect.
        const newValue = prevSelected.filter((v) => v !== value)

        // However, if a value is being deselected and allProductsValue
        // is present, then remove allProductsValue as well.
        if (
          newValue.length !== optionsLength &&
          newValue.includes(allProductsValue)
        ) {
          return newValue.filter((v) => v !== allProductsValue)
        }
        return newValue
      }

      // If the value was not previously selected and isAllProductsValue, select all products.
      if (isAllProductsValue) {
        return options.map((o) => o.value)
      }

      let newValue = [value, ...prevSelected]

      if (
        newValue.length === options.length - 1 &&
        !newValue.includes(allProductsValue)
      ) {
        newValue = [allProductsValue, ...newValue]
      }
      return newValue
    })
  }

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    onChange(selected)
  }, [selected]) // eslint-disable-line

  /* ======================
      renderOptions()
  ====================== */

  const renderOptions = () => {
    return options.map((option) => {
      const isActive = selected.includes(option.value)
      const isAllProductsValue = option.value === allProductsValue
      const allOptionsSelected = options.length === selected.length

      return (
        <button
          key={option.value}
          onClick={() => {
            handleClick(option.value)
          }}
          value=''
          title={option.title}
          className='flex items-center justify-center gap-2 rounded-full border border-blue-700 bg-blue-500 px-2 py-1 text-xs font-bold text-white'
          style={{ minWidth: 100 }}
        >
          {isActive && check}
          {isAllProductsValue && allOptionsSelected ? 'Clear' : option.title}
        </button>
      )
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <div className='mb-6 rounded-lg border border-blue-500 bg-white p-4'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {/* <h3 className='m-0 text-lg font-black text-blue-500'>Brands:</h3> */}
        {renderOptions()}
      </div>
    </div>
  )
}
