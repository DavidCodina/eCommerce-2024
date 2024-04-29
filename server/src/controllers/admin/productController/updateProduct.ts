import { Request, Response /* , NextFunction */ } from 'express'
import { z } from 'zod'
import Product from 'models/productModel'
//# import { stripe } from 'utils/stripe'
import { getZodErrors, handleServerError } from 'utils'

/* ======================
      updateProduct()
====================== */

export const updateProduct = async (req: Request, res: Response) => {
  const productId = req.params.id

  const { name, description, image, price, brand, category, stock, isActive } =
    req.body

  try {
    const product = await Product.findById(productId).exec()

    if (!product) {
      return res.status(404).json({
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    /* ======================
          Validation
    ====================== */

    const DataSchema = z.object({
      name: z.string().min(1, 'A name is required.'),
      description: z.string().min(1, 'A description is required.'),

      // image will be a string. However, it's not required.
      image: z.string().optional(),

      price: z
        .number()

        .refine(
          (value) => {
            return value > 0
          },
          {
            message: 'The price must be larger than 0.'
          }
        )

        .refine(
          (value) => {
            // This will also screen out negative values, but if you wanted negative values
            // in some other case, then use this: /^-?\d+(\.\d{1,2})?$/
            return (
              Number.isInteger(value) || ('' + value).match(/^\d+(\.\d{1,2})?$/)
            )
          },
          {
            message:
              'Invalid value: price must not contain more than two decimal places.'
          }
        ),

      brand: z.string().min(1, 'A brand is required.'),
      category: z.string().min(1, 'A category is required.'),
      stock: z
        .number()
        .refine(
          (value) => {
            return value >= 0
          },
          {
            message: 'Stock must not be negative.'
          }
        )

        .refine(
          (value) => {
            return Number.isInteger(value)
          },
          {
            message: 'Invalid value: stock must be an integer.'
          }
        ),

      isActive: z.boolean({
        required_error: 'isActive is required.',
        invalid_type_error: 'isActive must be a boolean.'
      })
    })

    const validationResult = DataSchema.safeParse({
      name,
      description,
      image,
      price,
      brand,
      category,
      stock,
      isActive
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

    /* ======================

    ====================== */

    //# At this point, I think the data should be used from the validationResult.
    //# Why? Zod filters out anything that is not part of the schema.

    //# If you're updating the name or price then you need to also update Stripe.
    //# Until that logic is implemented, name & price updating is disabled.

    //# This is also true for description, but somewhat less critical.

    // if (name && typeof name === 'string') {
    //   product.name = name
    // }

    if (image && typeof image === 'string') {
      product.image = `${image}`
    }

    if (description && typeof description === 'string') {
      product.description = description
    }

    // if (price && typeof price === 'number') {
    //   product.price = price
    // }

    if (brand && typeof brand === 'string') {
      product.brand = brand
    }

    if (category && typeof category === 'string') {
      product.category = category
    }

    if (stock && typeof stock === 'number') {
      product.stock = stock
    }

    if (typeof isActive === 'boolean') {
      product.isActive = isActive
    }

    const updatedProduct = await product.save()

    return res.status(200).json({
      data: updatedProduct,
      message: 'Success.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
