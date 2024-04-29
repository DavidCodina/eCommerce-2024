import { Request, Response /* , NextFunction */ } from 'express'
import Product from 'models/productModel'
import { handleServerError } from 'utils'

/* ======================
    getCartProducts()
====================== */
//! Filter by isActive:true here...

export const getCartProducts = async (req: Request, res: Response) => {
  const { productIds } = req.body

  if (!Array.isArray(productIds)) {
    return res.status(400).json({
      data: null,
      message: `'productIds' must be an array with at least one element.`,
      success: false
    })
  }

  try {
    const products = await Product.find(
      {
        _id: { $in: productIds }
      },
      '-creator'
    )

    //# Additionally, we might want to ensure that the result set
    //# matches the length of the productIds.

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    return res.status(200).json({
      data: products,
      message: 'Success.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
