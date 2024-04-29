import { Request, Response /* , NextFunction */ } from 'express'
import Product from 'models/productModel'
import { handleServerError } from 'utils'

/* ======================
    softDeleteProduct()
====================== */

export const softDeleteProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params

  // Not really necessary as this endpoint wouldn't get called without an :id.
  if (!productId) {
    return res.status(400).json({
      data: null,
      message: `The product '_id' must be provided.`,
      success: false
    })
  }

  try {
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(400).json({
        data: null,
        message: `Product not found.`,
        success: false
      })
    }

    product.isActive = false

    const updatedProduct = await product.save()

    return res.status(200).json({
      data: updatedProduct,
      message: "The product has been set to 'isActive:false'.",
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
