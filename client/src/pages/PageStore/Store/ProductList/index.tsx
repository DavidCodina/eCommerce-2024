import { Fragment, useState, useEffect } from 'react'
import { ProductItem } from '../ProductItem'
import { Alert, Paginator } from 'components'
import { debounce } from './lodash.debounce'

type PaginatedProducts = Record<number, Product[]>

type ProductListProps = {
  paginatedProducts: PaginatedProducts | null
  page: number
  limit: number
  onPageChange: (newPage: number) => void
  onReload: () => void
  count: number
  status: 'idle' | 'pending' | 'success' | 'error'
}

// Typeguard - not currently being used.
function _isPaginatedProducts(value: any): value is PaginatedProducts {
  if (value === null || !value || typeof value !== 'object') {
    return false
  }
  for (const key in value) {
    if (!Number.isInteger(Number(key)) || !Array.isArray(value[key])) {
      return false
    }
  }
  return true
}

/* ========================================================================
                              ProductList      
======================================================================== */

export const ProductList = ({
  onPageChange,
  //# onReload,
  page,
  paginatedProducts,
  count,
  status,
  limit
}: ProductListProps) => {
  const [numberedItems, setNumberedItems] = useState<1 | 3 | 5 | 7>(1)
  const totalPages = Math.ceil(count / limit)

  /* ======================
        useEffect()
  ====================== */
  // Update the number of numbered PaginationItems responsively by
  // setting numberedItems based on viewport width.

  useEffect(() => {
    // 'this' or 'e' could be used to get innerWidth when the function is called
    // from within the listener, but we also want to call it outside of the listener...
    function updateNumberedItems(/*this: any, e: any */) {
      if (window.innerWidth < 576) {
        setNumberedItems(1)
      } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
        setNumberedItems(3)
      } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
        setNumberedItems(5)
      } else if (window.innerWidth >= 992) {
        setNumberedItems(7)
      }
    }

    const debouncedUpdateNumberedItems: any = debounce(updateNumberedItems, 250)
    updateNumberedItems() // Call once on mount
    window.addEventListener('resize', debouncedUpdateNumberedItems)

    return () => {
      window.removeEventListener('resize', debouncedUpdateNumberedItems)
    }
  }, [])

  /* ======================
      renderPagination()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // This is the absolute most basic pagination you can have.
  // However, we ultimately want to use Paginator.
  //
  // const renderPagination = () => {
  //   return (
  //     <div className='flex justify-center'>
  //       <div className='mb-6 inline-flex items-center justify-center gap-4 rounded-xl border border-blue-500 bg-white px-4 py-2 font-bold text-blue-500'>
  //         <button onClick={() => onPageChange(page - 1)}>-</button>
  //         <div>{page}</div>
  //         <button onClick={() => onPageChange(page + 1)}>+</button>
  //       </div>
  //     </div>
  //   )
  // }
  //
  ///////////////////////////////////////////////////////////////////////////

  const renderPagination = () => {
    if (count < 1) {
      return null
    }

    return (
      <Fragment>
        <nav
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 5
          }}
        >
          <div
          // The borderRadius is defined by the buttons that are inside
          // of the pagination items <li>s. For that reason, it's a little
          // tricky to modify the borderRadius. This is a workaround for that.
          // It works in conjunciton with paginationStyle={{margin: -1 }}
          // But then the top and bottom of the focus shadow are cut off.
          // This is one of those situations where styled components would be
          // very useful.
          // style={{ borderRadius: 10, border: '1px solid #409', overflow: 'hidden' }}
          >
            <Paginator
              onClick={(newPage, _prevPage, _e) => {
                if (status === 'pending') {
                  return
                }
                if (typeof newPage === 'number') {
                  onPageChange(newPage)
                }

                ///////////////////////////////////////////////////////////////////////////
                //
                // Initially, I was setting prevPage as a side effect of currentPage changing.
                //
                //   useLayoutEffect(() => {
                //     return () => { setPrevPage(currentPage) }
                //   }, [currentPage])
                //
                // However, that's not necessary because Paginator's onClick now gives us prevPage
                // back, so we can set it at the same time as currentPage.
                //
                ///////////////////////////////////////////////////////////////////////////
              }}
              // Note: when active variants are not defined, they default to
              // the non-active counterparts. The active variants overwrite and
              // entirely REPLACE the non-active variants, rather than merging with them.
              // activePaginationButtonClassName=''
              activePaginationButtonStyle={{
                // Console warning: Removing a style property during rerender (border) when a conflicting
                // property is set (borderColor) can lead to styling bugs. To avoid this, don't mix
                // shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.
                backgroundColor: '#00b5e2',
                border: '1px solid #409',
                color: '#fff'
              }}
              // activePaginationItemClassName=''
              // activePaginationItemStyle={{}}

              // activeOnFocusButtonStyle={{
              //   backgroundColor: '#00b5e2',
              //   border: '1px solid #409',
              //   color: '#fff'
              // }}
              activeOnHoverButtonStyle={{
                backgroundColor: '#00b5e2',
                border: '1px solid #409',
                color: '#fff'
              }}
              paginationClassName=''
              paginationSize='small'
              paginationStyle={{
                margin: 0
              }}
              paginationItemClassName=''
              paginationItemStyle={{}}
              paginationButtonClassName=''
              paginationButtonStyle={{
                border: '1px solid #409',
                color: '#409'
              }}
              onFocusButtonStyle={{
                boxShadow: '0 0 0 0.25rem rgba(0, 181, 226, 0.5)',
                transition: 'none'
              }}
              onHoverButtonStyle={{ backgroundColor: '#409', color: '#fff' }}
              numberedItems={numberedItems}
              page={page}
              itemsPerPage={typeof limit === 'number' ? limit : 10}
              itemCount={count}
              showFirstLast={true}
              showPrevNext={true}
            />
          </div>
        </nav>
      </Fragment>
    )
  }

  /* ======================
        renderList()
  ====================== */
  //# We could create actual fallback UI indicating 0 products.
  //# This is probably a very good idea considering that this is
  //# an entirely likely case when a user makes a highly specific
  //# filtering selection.

  const renderList = () => {
    // pageProducts can be stale or fresh data or undefined
    const pageProducts = paginatedProducts?.[page]

    if (status === 'error' && !pageProducts) {
      //# Case 'error' should include a retry button.
      //# Use onReload?.()

      return (
        <Alert
          className='alert-red mx-auto my-12 max-w-2xl'
          leftSection={
            <svg
              style={{ height: '3em' }}
              fill='currentColor'
              viewBox='0 0 16 16'
            >
              <path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z' />
              <path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z' />
            </svg>
          }
        >
          <Alert.Heading>Error!</Alert.Heading>

          <p className='text-sm'>Unable to get products.</p>
        </Alert>
      )
    } else if (status === 'error') {
      //# In cases where there was an error, but there is stale data
      //# then just toast the error.
    }

    // Deprecated:
    // Spinner taken from https://nextui.org landing page.
    // if (status === 'pending' && !pageProducts) {
    //   return (
    //     <div
    //       aria-label='Loading'
    //       className='pointer-events-none fixed inset-0 flex items-center justify-center'
    //     >
    //       <div className='relative flex h-20 w-20'>
    //         <i className='absolute h-full w-full animate-[store-spinner-spin_0.8s_ease_infinite] rounded-full border-[6px] border-solid border-b-violet-800 border-l-transparent border-r-transparent border-t-transparent'></i>
    //         <i className='absolute h-full w-full animate-[store-spinner-spin_0.8s_linear_infinite] rounded-full border-[6px] border-dotted border-b-violet-800 border-l-transparent border-r-transparent border-t-transparent opacity-75'></i>
    //       </div>
    //     </div>
    //   )
    // }

    if (status === 'pending' && !pageProducts) {
      return (
        <div className='mx-auto mb-6 grid auto-rows-[minmax(0px,auto)] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6'>
          {[...Array(8).keys()].map((_item, index) => {
            return <ProductItem key={index} product={null} />
          })}
        </div>
      )
    }

    if (pageProducts) {
      return (
        <>
          <div className='mx-auto mb-6 grid auto-rows-[minmax(0px,auto)] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6'>
            {pageProducts.map((product) => {
              return <ProductItem key={product._id} product={product} />
            })}
          </div>

          {renderPagination()}

          <div style={{ color: '#00b5e2', fontSize: 12, textAlign: 'center' }}>
            Showing Page{' '}
            <span style={{ color: '#409', fontWeight: 'bold' }}>{page}</span> of{' '}
            <span style={{ color: '#409', fontWeight: 'bold' }}>
              {totalPages}
            </span>
          </div>
        </>
      )
    }

    // This would only occur if the consuming code was implemented incorrectly.
    return null
  }

  /* ======================
          return
  ====================== */

  return renderList()
}
