type SearchFilterProps = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

/* ========================================================================
                                SearchFilter 
======================================================================== */
// It's important that this component is controlled. search and
// setSearch need to be at the same level as the function that makes
// the API request. Why? Because we need to initialize search BEFORE
// the API request is made.

//# Add an X at the end of the SearchFilter that clears value.

export const SearchFilter = ({ search, setSearch }: SearchFilterProps) => {
  /* ======================
          return
  ====================== */

  return (
    <div className='relative flex-1'>
      <input
        autoComplete='off'
        className='w-full rounded-lg border border-blue-900 bg-white px-2 py-1 pl-10 focus:outline-none'
        id='search'
        name='search'
        onChange={(e) => {
          setSearch(e.target.value)
        }}
        placeholder='Search Products...'
        spellCheck={false}
        type='text'
        value={search}
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
