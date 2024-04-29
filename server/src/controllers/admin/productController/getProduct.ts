import { Request, Response /* , NextFunction */ } from 'express'
import Product from 'models/productModel'
import { handleServerError } from 'utils'

/* ======================
      getProduct()
====================== */

export const getProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params

  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        data: null,
        message: 'Resource not found.',
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
