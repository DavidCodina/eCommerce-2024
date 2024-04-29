import { useState, useMemo, useEffect } from 'react'

type MaybeProducts = Product[] | null
type SearchFilterProps = {
  onChange: (filteredProducts: Product[]) => void
  products: MaybeProducts
}

/* ========================================================================
                              SearchFilter     
======================================================================== */

export const SearchFilter = ({ onChange, products }: SearchFilterProps) => {
  const [query, setQuery] = useState('') // Todo: Debounce this

  /* ======================
      filteredProducts
  ====================== */
  // If not memoized then each time useEffect fires onChange, it triggers a rerender
  // in the parent component which rerenders this component which then generates
  // a new filteredProducts (i.e., new array) which then triggers useEffect again!

  const filteredProducts = useMemo(
    () =>
      (() => {
        let filteredProducts = products

        // On mount products may be null. In that case, return early.
        // This works in conjunction with the useEffect below, which
        // will also return early.
        if (!filteredProducts) {
          return filteredProducts
        }

        const searchTerm = query.trim().toLocaleLowerCase()
        if (searchTerm !== '') {
          filteredProducts = filteredProducts.filter((p) => {
            return p.name.toLowerCase().includes(searchTerm)
          })
        }

        return filteredProducts
      })(),
    [products, query]
  )

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    // On mount products may be null and thus filteredProducts may be null. In that case, return early.
    if (!filteredProducts) {
      return
    }
    onChange?.(filteredProducts)
  }, [filteredProducts]) // eslint-disable-line

  /* ======================
          return
  ====================== */

  return (
    <div className='relative flex-1'>
      <input
        autoComplete='off'
        spellCheck={false}
        type='text'
        id='search'
        className='w-full rounded-lg border border-blue-900 bg-white px-2 py-1 pl-10 focus:outline-none'
        placeholder='Search Products...'
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
      />
      <svg
        className='absolute left-2 top-1/2 -translate-y-1/2 stroke-blue-500'
        width='20'
        height='20'
        viewBox='0 0 24 24'
        strokeWidth='2'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
        <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
        <path d='M21 21l-6 -6' />
      </svg>
    </div>
  )
}
