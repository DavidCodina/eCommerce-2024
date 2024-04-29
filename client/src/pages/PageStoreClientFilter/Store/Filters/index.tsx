import { ChangeEvent, useState, useEffect, useMemo } from 'react'

// These filters are dumb/presentational components.
// All of the state is maintained within this parent component.
// Conversely, the SearchFilter which exists independently maintains
// it's own state. The difference between these two approaches is merely
// one of convenience. Duplicating the filteredProducts logic, onChange,
// handler, etc for each individual filter is unnecessary in this case
// because it can instead be managed at the level of the Filters component.
import { BrandFilter } from './BrandFilter'
import { CategoryFilter } from './CategoryFilter'
import { PriceFilter } from './PriceFilter'
import { RatingFilter } from './RatingFilter'
import {
  categoryOptions,
  priceOptions,
  brandOptions,
  ratingOptions
} from '../options'

type MaybeProducts = Product[] | null
type FiltersProps = {
  onChange: (filteredProducts: Product[]) => void
  products: MaybeProducts
  showFilters: boolean
}
type Price = (typeof priceOptions)[number]['value']
type Rating = (typeof ratingOptions)[number]['value']

/* ========================================================================
                          
======================================================================== */

export const Filters = ({ onChange, products, showFilters }: FiltersProps) => {
  const [categories, setCategories] = useState<string[]>([])
  const [price, setPrice] = useState<Price>('')
  const [rating, setRating] = useState<Rating>('')
  const [brands, setBrands] = useState<string[]>([])

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

        // Filter by category.
        if (categories.length > 0) {
          filteredProducts = filteredProducts.filter((p) =>
            categories.includes(p.category)
          )
        }

        // Filter by brand.
        if (brands.length > 0) {
          filteredProducts = filteredProducts.filter((p) => {
            return brands.includes(p.brand.toLowerCase())
          })
        }

        // Filter by price.
        if (price) {
          switch (price) {
            case '0-100':
              filteredProducts = filteredProducts.filter((p) => p.price <= 100)
              break

            case '100-500':
              filteredProducts = filteredProducts.filter(
                (p) => p.price >= 100 && p.price <= 500
              )
              break

            case '500-1000':
              filteredProducts = filteredProducts.filter(
                (p) => p.price >= 500 && p.price <= 1000
              )
              break

            case '1000':
              filteredProducts = filteredProducts.filter((p) => p.price >= 1000)
              break

            default:
              break
          }
        }

        // Filter by rating
        if (rating) {
          switch (rating) {
            case '1':
              filteredProducts = filteredProducts.filter((p) => p.rating >= 1)
              break

            case '2':
              filteredProducts = filteredProducts.filter((p) => p.rating >= 2)
              break

            case '3':
              filteredProducts = filteredProducts.filter((p) => p.rating >= 3)
              break

            case '4':
              filteredProducts = filteredProducts.filter((p) => p.rating >= 4)
              break

            case '5':
              filteredProducts = filteredProducts.filter((p) => p.rating >= 5)
              break

            default:
              break
          }
        }

        return filteredProducts
      })(),
    [brands, categories, price, products, rating]
  )

  /* ======================
    handleCategoryChange()
  ====================== */

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const isChecked = e.target.checked

    setCategories((prevSelectedCategories) => {
      const includesCategory = prevSelectedCategories.includes(value)

      if (isChecked && includesCategory) {
        return prevSelectedCategories
      } else if (isChecked) {
        return [value, ...prevSelectedCategories]
      }

      if (!isChecked && !includesCategory) {
        return prevSelectedCategories
      }

      // else if (!isChecked)
      const newSelectedCategories = [...prevSelectedCategories]
      return newSelectedCategories.filter((category) => category !== value)
    })
  }

  /* ======================
    handleBrandChange()
  ====================== */

  const handleBrandChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const isChecked = e.target.checked

    setBrands((prevSelectedBrands) => {
      const includesBrand = prevSelectedBrands.includes(value)

      if (isChecked && includesBrand) {
        return prevSelectedBrands
      } else if (isChecked) {
        return [value, ...prevSelectedBrands]
      }

      if (!isChecked && !includesBrand) {
        return prevSelectedBrands
      }

      // else if (!isChecked)
      const newSelectedBrands = [...prevSelectedBrands]
      return newSelectedBrands.filter((brand) => brand !== value)
    })
  }

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
        renderFilters()
  ====================== */
  //# The filters would work better as a separate OffCanvas.
  //# Currently, it's similar to that, but just a fixed <div>.
  //# It's definitely annoying to have to manually close the filters sidebar.

  const renderFilters = () => {
    if (!showFilters) {
      return null
    }
    return (
      <div
        className='fixed bottom-0 left-0 flex h-full w-[250px] flex-col gap-6 overflow-y-scroll border-r border-blue-500 bg-white px-4 pb-4 pt-16'
        style={{ boxShadow: '4px 0px 8px rgba(0,0,0,0.25)' }}
      >
        <CategoryFilter
          onChange={handleCategoryChange}
          options={categoryOptions}
          value={categories}
        />

        <BrandFilter
          onChange={handleBrandChange}
          options={brandOptions}
          value={brands}
        />

        <PriceFilter
          onChange={(e) => {
            const value = e.target.value
            const validPrices = priceOptions.map((p) => p.value)

            const isValidPrice = (
              price: string,
              validPrices: readonly Price[]
            ): price is Price => {
              return validPrices.includes(price as Price)
            }

            if (isValidPrice(value, validPrices)) {
              setPrice(value)
            }
          }}
          options={priceOptions}
          value={price}
        />

        <RatingFilter
          onChange={(e) => {
            const value = e.target.value
            const validRatings = ratingOptions.map((r) => r.value)

            const isValidRating = (
              rating: string,
              validRatings: readonly Rating[]
            ): rating is Rating => {
              return validRatings.includes(rating as Rating)
            }

            if (isValidRating(value, validRatings)) {
              setRating(value)
            }
          }}
          options={ratingOptions}
          value={rating}
        />
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return renderFilters()
}
