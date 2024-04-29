import { Request, Response /* , NextFunction */ } from 'express'
import Product from 'models/productModel'
import { handleServerError } from 'utils'

/* ======================
      getProduct()
====================== */

export const getProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params

  try {
    const product = await Product.findById(productId).select('-creator')

    if (!product) {
      return res.status(404).json({
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    if (product.isActive === false) {
      return res.status(400).json({
        data: null,
        message: 'Inactive products are not accessible.',
        success: false
      })
    }

    return res.status(200).json({
      data: product,
      message: 'Success.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
