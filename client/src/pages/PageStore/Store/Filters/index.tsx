import { ChangeEvent, Dispatch, SetStateAction } from 'react'
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

import {
  RadixAccordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger
} from 'components/RadixAccordion'

import { OffCanvas } from 'components/OffCanvas'

type Price = (typeof priceOptions)[number]['value']
type Rating = (typeof ratingOptions)[number]['value']

type FiltersProps = {
  showFilters: boolean
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
  categories: string[]
  setCategories: Dispatch<SetStateAction<string[]>>
  brands: string[]
  setBrands: Dispatch<SetStateAction<string[]>>
  price: Price
  setPrice: Dispatch<SetStateAction<Price>>
  rating: Rating
  setRating: Dispatch<SetStateAction<Rating>>
}

/* ========================================================================
                                Filters
======================================================================== */

export const Filters = ({
  showFilters,
  setShowFilters,
  categories,
  setCategories,
  brands,
  setBrands,
  price,
  setPrice,
  rating,
  setRating
}: FiltersProps) => {
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
      renderFilters()
  ====================== */

  const renderFilters = () => {
    return (
      <OffCanvas
        className={`border-r-2 bg-[--tw-body-color] [--offcanvas-border-color:theme(colors.blue.500)]`}
        // disableBodyClick
        // disableBackdrop will cause the value to become false then true again.
        // The solution is to set  data-toggle='offcanvas' on the <FilterButton />
        disableBackdrop
        disableScrollLock
        placement='start'
        value={showFilters}
        onChange={(newValue) => {
          setShowFilters(newValue)
        }}
        duration={200}
        style={{ overflowY: 'auto' }}
      >
        <RadixAccordion
          className={`
          border-x-0
          border-t-0
          [--radix-accordion-animation-duration:200ms]
          [--radix-accordion-border-color:theme(colors.blue.500)]          
          [--radix-accordion-border-radius:0px]
          [--radix-accordion-chevron-size:1.5em]
          [--radix-accordion-trigger-bg:--tw-body-color]
          [--radix-accordion-trigger-color:theme(colors.blue.500)]
          [--radix-accordion-trigger-hover-bg:theme(colors.blue.500)]
          [--radix-accordion-trigger-hover-color:#fff]
          `}
          type='multiple'
        >
          <AccordionItem value='item1'>
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              <CategoryFilter
                className='p-4'
                onChange={handleCategoryChange}
                options={categoryOptions}
                value={categories}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='item2'>
            <AccordionTrigger>Brand</AccordionTrigger>
            <AccordionContent>
              <BrandFilter
                className='p-4'
                onChange={handleBrandChange}
                options={brandOptions}
                value={brands}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='item3'>
            <AccordionTrigger>Price</AccordionTrigger>

            <AccordionContent>
              <PriceFilter
                className='p-4'
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
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='item4'>
            <AccordionTrigger>Rating</AccordionTrigger>

            <AccordionContent>
              <RatingFilter
                className='p-4'
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
            </AccordionContent>
          </AccordionItem>
        </RadixAccordion>
      </OffCanvas>
    )
  }

  /* ======================
          return
  ====================== */

  return renderFilters()
}
