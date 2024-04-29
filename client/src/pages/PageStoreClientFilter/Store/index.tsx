import { Fragment, useState, useEffect } from 'react'

import { useAppContext } from 'contexts'

import { Alert } from 'components'
import { StoreNav } from './StoreNav'
import { Navicon } from 'components/Navicon'
import { SearchFilter } from './SearchFilter'
import { FilterButton } from './FilterButton'
import { CartButton } from 'components/CartButton'
import { Filters } from './Filters' // i.e., other filters.
import { ProductList } from './ProductList'

import { getProducts } from 'clientAPI'
import './index.css'

type MaybePaginatedProductsData = Awaited<
  ReturnType<typeof getProducts>
>['data']

/* ========================================================================
                          
======================================================================== */
//# We need a modified solution for the <StoreNav />
//# Ultimately, we want the CartButton to be to the left of the Navicon
//# on other pages -like ProductPage.
//# Because we're not going to be using it everywhere, we don't need to put it
//# in the layout. Instead we can fix it on certain pages.
//# However, it needs to be able to take in style/className props.

export const Store = () => {
  const { showMenu, setShowMenu } = useAppContext()

  /* ======================
        state & refs
  ====================== */

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  const [productsData, setProductsData] =
    useState<MaybePaginatedProductsData>(null)

  const products = Array.isArray(productsData?.products)
    ? productsData.products
    : null

  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(
    null
  )
  const [showFilters, setShowFilters] = useState(false)

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    setStatus('pending')

    getProducts('?filterBy=isActive:true')
      .then((json) => {
        const { data, success } = json

        if (success === true && data && typeof data === 'object') {
          setProductsData(data)

          setStatus('success')
        } else {
          setStatus('error')
        }

        return json
      })
      .catch((err) => {
        setStatus('error')

        return err
      })
  }, [])

  /* ======================
    renderProductList()
  ====================== */

  const renderProductList = () => {
    if (status === 'error') {
      // Todo: Case 'error' should include a retry button.

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
    }

    // Because nothing else is shown on the page, we can get away with position:fixed and centering.
    // Spinner taken from https://nextui.org landing page.
    if (status === 'pending') {
      return (
        <div
          aria-label='Loading'
          className='pointer-events-none fixed inset-0 flex items-center justify-center'
        >
          <div className='relative flex h-20 w-20'>
            <i className='absolute h-full w-full animate-[store-spinner-spin_0.8s_ease_infinite] rounded-full border-[6px] border-solid border-b-violet-800 border-l-transparent border-r-transparent border-t-transparent'></i>
            <i className='absolute h-full w-full animate-[store-spinner-spin_0.8s_linear_infinite] rounded-full border-[6px] border-dotted border-b-violet-800 border-l-transparent border-r-transparent border-t-transparent opacity-75'></i>
          </div>
        </div>
      )
    }

    //# Could also include UI for if their is filteredProducts, but length is 0.

    if (status === 'success' && Array.isArray(filteredProducts)) {
      return <ProductList products={filteredProducts} />
    }

    // Fallback...
    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <StoreNav>
        <SearchFilter
          onChange={(newValue) => {
            setFilteredProducts(newValue)
          }}
          products={products}
        />

        <FilterButton
          onClick={() => {
            setShowFilters((v) => !v)
          }}
        />

        <CartButton style={{ color: '#fff' }} />

        <Navicon
          data-toggle='offcanvas'
          onClick={() => setShowMenu((v) => !v)}
          iconClassName={`text-white`}
          show={showMenu}
        />
      </StoreNav>

      {renderProductList()}

      <Filters
        onChange={(newValue) => {
          setFilteredProducts(newValue)
        }}
        products={products}
        showFilters={showFilters}
      />
    </Fragment>
  )
}
