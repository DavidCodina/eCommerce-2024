import { Request, Response /* , NextFunction */ } from 'express'
import Product from 'models/productModel'
import { handleServerError } from 'utils'

/* ========================================================================
                              getProducts()       
======================================================================== */
// Note: In the Traversy Ecommerce 2023 project in video 4.8 he creates
// a custom asyncHandler. I did not do that here, but it's worth going back to
// and reviewing.

export const getProducts = async (req: Request, res: Response) => {
  const {
    sortBy = 'desc',
    orderBy = 'createdAt',
    filterBy = 'isActive:true',
    select = '-creator'
  } = req.query
  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query.limit ? Number(req.query.limit) : Infinity

  const sortByValue = sortBy === 'desc' ? -1 : 1
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  try {
    let query = Product.find()

    ///////////////////////////////////////////////////////////////////////////
    //
    // If there are no products or 0 products, we don't need return a 404.
    // Conceptually, it might be acceptable that there are no products.
    // MongoDB will return an empty result set ([]), so !products will actually
    // never even occur.
    //
    //   if (!products) {
    //     return res.status(404).json({ data: null, message: `Resource not found.`,  success: false })
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////

    /* ======================
            select
    ====================== */

    if (select && typeof select === 'string') {
      const selectArray = select
        .split(',')
        // Explicitly prohibit 'creator' being selected. 'creator' is only for admins.
        // Thus if an inclusion projection is specified, 'creator' will be removed.
        // Otherwise, if no inclusion projection is specified, then the default
        // exclusion projection of '-creator' will run.
        .filter((selection) => selection !== 'creator')

      const formattedSelect = selectArray.join(' ')

      query.select(formattedSelect)
    }

    /* ======================
          filterBy
    ====================== */
    //# Add this updated filter logic to other controllers............................

    if (filterBy && typeof filterBy === 'string') {
      const filters = (() => {
        ///////////////////////////////////////////////////////////////////////////
        //
        // Gotcha: the 'name' part of the filterBy value could contain ANY character,
        // including "," and ":". That's slightly problematic because those are the
        // characters that we ordinarily split on below.
        //
        // The easiest way to get around this is to split on 'name:' first.
        // Because the client SHOULD (hopefully) be sending "name: ..." at the end of the filterBy
        // string, we can reasonaly assume that everything after 'name:' is the name value.
        // Admittedly, this strategy might not be foolproof if it was a public API, but for
        // now it works.
        //
        ///////////////////////////////////////////////////////////////////////////

        const splitFilterBy = filterBy.split('name:')
        const name = splitFilterBy[1] || ''
        const otherFilters = splitFilterBy[0] || ''

        const obj = otherFilters
          .split(',')
          // Remove empty ('') values that could result from a possible trailing comma.
          .filter((f) => !!f)
          .reduce((acc: any, filter) => {
            const [key, value] = filter.split(':')
            if (acc[key]) {
              acc[key].push(value)
            } else {
              acc[key] = [value]
            }
            return acc
          }, {})

        // For the public getProducts() controller, we always hardcode isActive.
        // Only the admin version will have access to inactive products.
        obj.isActive = ['true']

        // Convert brand filters to case-insensitive regex values.
        if ('brand' in obj && Array.isArray(obj['brand'])) {
          const brands = obj['brand'] // => [ 'samsung', 'sony' ]
          const regexBrands = brands.map((brand) => new RegExp(brand, 'i')) // => [ /samsung/i, /sony/i ]
          obj['brand'] = regexBrands
        }

        // Convert single item arrays to the item itself.
        // Convert arrays to use $in syntax.
        for (const key in obj) {
          if (Array.isArray(obj[key])) {
            if (obj[key].length === 1) {
              obj[key] = obj[key][0]
            } else {
              obj[key] = { $in: obj[key] }
            }
          }
        }

        // If name exists, add it to obj
        if (name) {
          obj.name = {
            $regex: name, // Exact match: `^${value}$`,
            $options: 'i'
          }
        }

        // Convert price filter to use comparison operators
        if (
          'price' in obj &&
          obj['price'] &&
          typeof obj['price'] === 'string'
        ) {
          // value will be '0-100', '100-500', '500-1000', '1000'
          const value = obj['price'].split('-')
          if (value.length === 1) {
            obj['price'] = { $gte: value?.[0] }
          } else {
            obj['price'] = { $gte: value?.[0], $lte: value?.[1] }
          }
        }

        // Convert rating filter to use a $gte comparison operator.
        if (
          'rating' in obj &&
          obj['rating'] &&
          typeof obj['rating'] === 'string'
        ) {
          const value = obj['rating']
          // value will be '1', '2', '3', '4', '5' but Mongoose will typecast it as a number.
          obj['rating'] = { $gte: value }
        }

        ///////////////////////////////////////////////////////////////////////////
        //
        // Note: All filters are exclusive. Thus, if you selected a category:'cameras' and brand:'sony'
        // it would show you ONLY Sony cameras and not all cameras + all Sony products.
        // This is generally the expected behavior, but if for some reason you wanted certain
        // filters to behave inclusively, you could transform obj such that it groups
        // certain filters into an $or array.
        //
        //   const createOrFilter = (orKeys: string[] = []) => {
        //     const or: Record<string, any>[] = []
        //     for (const key in obj) {
        //       if (orKeys.includes(key)) {
        //         or.push({ [key]: obj[key] })
        //         delete obj[key]
        //       }
        //     }
        //     if (or.length > 0) { obj['$or'] = or }
        //   }
        //
        //   createOrFilter(['category', 'brand', 'name'])
        //
        ///////////////////////////////////////////////////////////////////////////

        return obj
      })()

      query = query.find(filters)
    }

    /* ======================
        orderBy / sortBy
    ====================== */
    //# What about multi-sort.
    //# Also how would we sort by paymentStatus: 'paid' vs everything else?
    //# Ask AI.

    if (orderBy && typeof orderBy === 'string') {
      query = query.sort({ [orderBy]: sortByValue })
    }

    /* ======================
          pagination
    ====================== */

    const count = await Product.countDocuments(query.getFilter())
    const isPreviousPage = startIndex > 0
    const isNextPage = endIndex < count
    const previousPage = page > 1 ? page - 1 : null // If undefined, then it will be omitted from the JSON, so instead use null
    const hasNext = count ? page * limit < count : false
    const nextPage = hasNext ? page + 1 : null // If undefined, then it will be omitted from the JSON, so instead use null

    // Because we are using Infinity as the default limit, we need to implement the ternary.
    const pages = Math.ceil(count / limit) === 0 ? 1 : Math.ceil(count / limit)

    // Limit the results to the subset of data between startIndex & endIndex.
    // If the page * limit > count, then an empty array is sent back.
    query = query.limit(limit).skip(startIndex)

    /* ======================
            Response
    ====================== */
    // Example usage: http://localhost:5000/api/products?filterBy=brand:Sony&select=name,-_id,brand&limit=1&page=2

    const products = await query.exec()

    return res.status(200).json({
      data: {
        products,
        count,
        nextPage,
        previousPage,
        isNextPage,
        isPreviousPage,
        pages,
        currentPage: page
      },
      message: 'Success.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
