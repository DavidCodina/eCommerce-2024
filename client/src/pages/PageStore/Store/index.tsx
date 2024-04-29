import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAppContext } from 'contexts'
import { StoreNav } from './StoreNav'
import { Navicon } from 'components/Navicon'
import { SearchFilter } from './SearchFilter'
import { FilterButton } from './FilterButton'
import { CartButton } from 'components/CartButton'
import { Filters } from './Filters' // i.e., other filters.
import { ProductList } from './ProductList'
import { getProducts, PaginatedProductsData } from 'clientAPI'
import { useDebouncedValue } from 'hooks'
import { priceOptions, ratingOptions } from './options'
import { sleep } from 'utils'
import './index.css'

type PaginatedProducts = Record<number, Product[]>
type Price = (typeof priceOptions)[number]['value']
type Rating = (typeof ratingOptions)[number]['value']

const limit = 4

/* ========================================================================
                              Store             
======================================================================== */

//# We should have UI indicating  what the current order is
//# from the '/store' page. Then the user can choose to clear the current order + cart
//# and start fresh if they want to.

//# We need a modified solution for the <StoreNav />
//# Ultimately, we want the CartButton to be to the left of the Navicon
//# on other pages -like ProductPage.
//# Because we're not going to be using it everywhere, we don't need to put it
//# in the layout. Instead we can fix it on certain pages.
//# However, it needs to be able to take in style/className props.

//# Update server controllers to have maximal flexibility in regard to filtering/sorting.

//# Work on Nightwind.

//# Add in React Idle Timer.

//# Review the following videos:
///////////////////////////////////////////////////////////////////////////
//
// WDS:          https://www.youtube.com/watch?v=VenLRGHx3D4
//               https://www.youtube.com/watch?v=oZZEI23Ri6E
// ByteGrad:     https://www.youtube.com/watch?v=ukpgxEemXsk&t=2s
// CoderOne:     https://www.youtube.com/watch?v=h9hYnDe8DtI&t=145s
// Sam Selikoff: https://www.youtube.com/watch?v=sFTGEs2WXQ4
// Theo:         https://www.youtube.com/watch?v=t3FUkq7yoCw
//
// John Reilly:  https://blog.logrocket.com/use-state-url-persist-state-usesearchparams/
//               https://johnnyreilly.com/react-usesearchparamsstate
//
///////////////////////////////////////////////////////////////////////////

export const Store = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showMenu, setShowMenu } = useAppContext()

  /* ======================
        state & refs
  ====================== */

  const firstRenderRef = useRef(true)

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  // All data returned from the getProducts() response.
  const [productsData, setProductsData] =
    useState<PaginatedProductsData | null>(null)

  // A dictionary of products chunked by page (number) keys.
  const [paginatedProducts, setPaginatedProducts] =
    useState<PaginatedProducts | null>(null)

  const [currentPage, setCurrentPage] = useState(() => {
    const currentPage = searchParams.get('page')

    // If there is no key/value for currentPage query string, it will be null.
    if (currentPage && typeof currentPage === 'string') {
      return parseInt(currentPage)
    }

    return 1
  })

  const [name, setName] = useState(() => {
    const filterBy: any = searchParams.get('filterBy')

    if (filterBy) {
      // Rather than splitting on comma, we can split on 'name:'
      // Because nameString is appended at the END of filterByValue
      // We know that everything after 'name:' is the name value.
      const splitFilterBy = filterBy.split('name:') // => ['name:a7', 'c']
      const nameValue = splitFilterBy[1] || ''

      if (nameValue) {
        return nameValue
      }
    }

    return ''
  })

  const [debouncedName] = useDebouncedValue(name, 500)

  const [showFilters, setShowFilters] = useState(false)

  const productCount =
    typeof productsData?.count === 'number' ? productsData?.count : 0

  /* ======================
         categories
  ====================== */

  const [categories, setCategories] = useState<string[]>(() => {
    const filterBy: any = searchParams.get('filterBy')

    if (filterBy) {
      const categoriesFromURL = filterBy
        .split(',')
        .filter((item: string) => {
          return !!item && item.startsWith('category')
        })
        .map((item: string) => {
          return item.split(':')?.[1]
        })

      if (Array.isArray(categoriesFromURL) && categoriesFromURL.length > 0) {
        return categoriesFromURL as string[]
      }
    }

    return []
  })

  /* ======================
          brands
  ====================== */

  const [brands, setBrands] = useState<string[]>(() => {
    const filterBy: any = searchParams.get('filterBy')

    if (filterBy) {
      const brandsFromURL = filterBy
        .split(',')
        .filter((item: string) => {
          return !!item && item.startsWith('brand')
        })
        .map((item: string) => {
          return item.split(':')?.[1]
        })

      if (Array.isArray(brandsFromURL) && brandsFromURL.length > 0) {
        return brandsFromURL as string[]
      }
    }

    return []
  })

  /* ======================
          price
  ====================== */

  const [price, setPrice] = useState<Price>(() => {
    const filterBy: any = searchParams.get('filterBy')

    if (filterBy) {
      const priceFromURL = filterBy
        .split(',')
        .filter((item: string) => {
          return !!item && item.startsWith('price')
        })
        .map((item: string) => {
          return item.split(':')?.[1]
        })

      if (Array.isArray(priceFromURL) && priceFromURL.length > 0) {
        return priceFromURL[0] as Price
      }
    }

    return ''
  })

  /* ======================
          rating
  ====================== */

  const [rating, setRating] = useState<Rating>(() => {
    const filterBy: any = searchParams.get('filterBy')

    if (filterBy) {
      const ratingFromURL = filterBy
        .split(',')
        .filter((item: string) => {
          return !!item && item.startsWith('rating')
        })
        .map((item: string) => {
          return item.split(':')?.[1]
        })

      if (Array.isArray(ratingFromURL) && ratingFromURL.length > 0) {
        return ratingFromURL[0] as Rating
      }
    }

    return ''
  })

  /* ======================
       filterByValue
  ====================== */

  const filters = useMemo(() => {
    const categoryFilters = categories.map((c) => {
      return {
        category: c
      }
    })

    const brandFilters = brands.map((b) => {
      return {
        brand: b
      }
    })

    const filtersArray: Record<string, string>[] = [
      ...categoryFilters,
      ...brandFilters
    ]

    if (price !== '') {
      filtersArray.push({ price })
    }

    if (rating !== '') {
      filtersArray.push({ rating })
    }

    return filtersArray
  }, [categories, brands, price, rating])

  // Derived state that takes array of filters and reduces it to a formatted string
  // that can be interpolated into the queryString passed to getProducts().
  const filterString = (() => {
    const value = filters.reduce((acc, filter) => {
      const key = Object.keys(filter)[0] as string
      const value = filter[key]
      return acc + `,${key}:${value}`
    }, '')

    return value
  })()

  // Derived state that takes search and formats it into the queryString.
  const nameString = (() => {
    let value = debouncedName.trim() ? debouncedName.trim() : ''
    value = value ? `,name:${value}` : ''
    return value.toLowerCase()
  })()

  // Remove the leading ',' and encode it.
  const filterByValue = encodeURIComponent(
    `${filterString}${nameString}`.substring(1)
  )

  /* ======================
    handleGetProducts()
  ====================== */

  const handleGetProducts = useCallback(
    async ({
      currentPage,
      filterByValue
    }: {
      currentPage: number
      filterByValue: string
    }) => {
      //                             ↓↓↓  Add the "," back!
      const filterBy = `isActive:true,${filterByValue}`
      const queryString = `?page=${currentPage}&limit=${limit}&filterBy=${filterBy}`
      setStatus('pending')

      try {
        await sleep(2500)

        const json = await getProducts(queryString)
        const { data, success } = json

        if (success === true && data && typeof data === 'object') {
          setProductsData(data)

          setPaginatedProducts((prevPaginatedProducts) => {
            return {
              ...prevPaginatedProducts,
              [data.currentPage]: data.products
            }
          })

          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch (err) {
        setStatus('error')

        return err
      }
    },
    []
  )

  /* ======================
        useEffect()
  ====================== */
  // Anytime a filter changes, reset currentPage, productsData and paginatedProducts.

  useEffect(() => {
    // Gotcha: This would otherwise run on mount, which we definitely don't want.
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }

    setCurrentPage(1)
    setProductsData(null)
    setPaginatedProducts(null)
  }, [filterByValue])

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    handleGetProducts({ currentPage, filterByValue })
  }, [currentPage, filterByValue, handleGetProducts])

  /* ======================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // WDS:          https://www.youtube.com/watch?v=VenLRGHx3D4
  //               https://www.youtube.com/watch?v=oZZEI23Ri6E
  // ByteGrad:     https://www.youtube.com/watch?v=ukpgxEemXsk&t=2s
  // CoderOne:     https://www.youtube.com/watch?v=h9hYnDe8DtI&t=145s
  // Sam Selikoff: https://www.youtube.com/watch?v=sFTGEs2WXQ4
  // Theo:         https://www.youtube.com/watch?v=t3FUkq7yoCw
  //
  // John Reilly:  https://blog.logrocket.com/use-state-url-persist-state-usesearchparams/
  //               https://johnnyreilly.com/react-usesearchparamsstate
  //
  ///////////////////////////////////////////////////////////////////////////

  // A better approach would be to get the search params from the URL then update page AND filters,
  // while also including anything else that is in the searchParams. That said, merely overwriting
  // all params is okay for now.
  useEffect(() => {
    let newParams = `?page=${currentPage}`

    if (filterByValue) {
      newParams = `${newParams}&filterBy=${filterByValue}`
    }

    navigate(newParams)
  }, [currentPage, filterByValue, navigate])

  // Check to make sure that navigate isn't triggering a remount.
  // useEffect(() => { console.log('Page Mounted!')}, [])

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <StoreNav>
        <SearchFilter search={name} setSearch={setName} />

        <FilterButton
          data-toggle='offcanvas'
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

      <ProductList
        status={status}
        count={productCount}
        limit={limit}
        paginatedProducts={paginatedProducts}
        page={currentPage}
        onPageChange={(newPage) => {
          setCurrentPage(newPage)
        }}
        onReload={() => {
          handleGetProducts({ currentPage, filterByValue })
        }}
      />

      <Filters
        categories={categories}
        setCategories={setCategories}
        brands={brands}
        setBrands={setBrands}
        price={price}
        setPrice={setPrice}
        rating={rating}
        setRating={setRating}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </Fragment>
  )
}
