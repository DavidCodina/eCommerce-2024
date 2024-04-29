import { Request, Response } from 'express'
import { z } from 'zod'

import Product from 'models/productModel'
import { getZodErrors } from 'utils'
import { handleServerError } from 'utils'

/* ======================
  createProductReview()
====================== */
// Currently, reviews exists as a subschema of Product. However,
// it's worth considering treating it as its own independent entity/Model.

export const createProductReview = async (req: Request, res: Response) => {
  const user = req.user
  const productId = req.params?.id
  const { rating, comment } = req.body

  try {
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        data: null,
        message: `Resource not found.`,
        success: false
      })
    }

    // This is more just to appease typescript.s
    if (!user) {
      return res.status(400).json({
        data: null,
        message: 'Could not find associated user..',
        success: false
      })
    }

    /* ======================
          alreadyReviewed 
    ====================== */

    const alreadyReviewed = product?.reviews?.find((review: any) =>
      review.user.equals(user?._id)
    )

    if (alreadyReviewed) {
      res.status(400)
      return res.status(409).json({
        data: null,
        message: 'The user has already reviewed this product.',
        success: false
      })
    }

    /* ======================
          Validation
    ====================== */

    const DataSchema = z.object({
      rating: z
        .number()
        .min(0, 'Rating must be at least 0.')
        .max(5, 'Rating must be at most 5.'),

      comment: z
        .string()
        .min(15, 'Comment must be at least 15 characters. (Server)')
        .refine((value) => value.trim() !== '', 'Invalid value.')
    })

    const validationResult = DataSchema.safeParse({
      rating,
      comment
    })

    let errors: Record<string, string> = {}

    if ('error' in validationResult) {
      const error = validationResult.error
      if (error instanceof z.ZodError) {
        errors = getZodErrors(error.issues)
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        data: null,
        errors: errors,
        message: 'The form data is invalid.',
        success: false
      })
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        data: null,
        errors: errors,
        message: 'The form data is invalid.',
        success: false
      })
    }

    /* ======================

    ====================== */
    //# At this point, I think the data should be used from the validationResult.
    //# Why? Zod filters out anything that is not part of the schema.

    const review: ProductReview = {
      userName: user.userName,
      comment: comment,
      rating: Number(rating),
      user: user._id
    }

    product.reviews.push(review)

    // This is useful in cases where we omit the reviews, but still want the number of reviews.
    product.reviewCount = product.reviews.length

    // Calculate the rating by summing all ratings then dividing by the number of reviews.
    product.rating =
      product.reviews.reduce(
        (acc: number, review: any) => review.rating + acc,
        0
      ) / product.reviews.length

    const updatedProduct = await product.save()

    return res.status(200).json({
      data: updatedProduct,
      message: 'Product updated with review.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
