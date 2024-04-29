import { Request, Response /* , NextFunction */ } from 'express'
import Product from 'models/productModel'
import { stripe } from 'utils/stripe'
import { z } from 'zod'
import { getZodErrors, handleServerError } from 'utils'

// Note: In the Traversy Ecommerce 2023 project in video 4.8 he creates
// a custom asyncHandler. I did not do that here, but it's worth going back to
// and reviewing.

/* ======================
    createProduct()
====================== */

//`  The normal product route currently has: router.post(createProduct),
//`  This needs to be removed in favor of the admin one here.
//`  Additionally, seedRoutes.ts will need to be reviewed and updated.

//# I have no clue if this is the best way to create the product.
//# Ultimately, I need to learn more about the Stripe SDK:
//# https://www.youtube.com/watch?v=8xzX6awAENU

export const createProduct = async (req: Request, res: Response) => {
  const user = req.user

  //! Don't do this. Instead just get the properties.
  //! Also change consuming code in client app.

  const { product } = req.body

  // Obviously do more validation than this.
  if (!product || typeof product !== 'object') {
    return res.status(400).json({
      data: null,
      message: `Request data not found.`,
      success: false
    })
  }

  const { name, price, brand, category, stock, description } = product

  /* ======================
          Validation
   ====================== */

  const DataSchema = z.object({
    name: z.string().min(1, 'A name is required.'),
    description: z.string().min(1, 'A description is required.'),
    price: z
      .string()
      .min(1, 'A price is required.')

      .refine(
        (value) => {
          // Number('') type coerces to 0, so in order to prevent a false positive,
          // we can perform a quick check BEFORE using Number(value). This works
          // similar to  .min(1, 'A price is required.'), but min() does not catch
          // empty spaces.
          if (value.trim() === '') {
            return false
          }

          return !isNaN(Number(value))
        },
        {
          message: 'Invalid value (must be a number).'
        }
      )
      .transform(Number) // Convert to number for subsequent validations

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
      )

      .transform(String), // Convert back to string

    brand: z.string().min(1, 'A brand is required.'),
    category: z.string().min(1, 'A category is required.'),
    stock: z
      .string()
      .min(1, 'Stock is required.')

      .refine(
        (value) => {
          if (value.trim() === '') {
            return false
          }
          return !isNaN(Number(value))
        },
        {
          message: 'Invalid value (must be a number).'
        }
      )
      .transform(Number) // Convert to number for subsequent validations

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
      )

      .transform(String) // Convert back to string
  })

  const validationResult = DataSchema.safeParse({
    name,
    description,
    price,
    brand,
    category,
    stock
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

  try {
    //# At this point, I think the data should be used from the validationResult.
    //# Why? Zod filters out anything that is not part of the schema.

    //# We may want to validate for name uniqueness...

    // https://docs.stripe.com/api/products/create
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
      default_price_data: {
        currency: 'usd',
        unit_amount: price * 100 // Stripe prices are in cents
      }
    })

    ///////////////////////////////////////////////////////////////////////////
    //
    // stripeProduct: {
    //   id: 'prod_PnhbnTvws3I260',
    //   object: 'product',
    //   active: true,
    //   attributes: [],
    //   created: 1711344927,
    //   default_price: 'price_1Oy6Bv2KoYCkp3crQ0chWRPt',
    //   description: 'Bla, bla, bla...',
    //   features: [],
    //   images: [],
    //   livemode: false,
    //   metadata: {},
    //   name: 'Test Product A',
    //   package_dimensions: null,
    //   shippable: null,
    //   statement_descriptor: null,
    //   tax_code: null,
    //   type: 'service',
    //   unit_label: null,
    //   updated: 1711344927,
    //   url: null
    // }
    //
    ///////////////////////////////////////////////////////////////////////////

    if (!stripeProduct.id || !stripeProduct.default_price) {
      return res.status(500).json({
        data: null,
        message: `The stripeProduct.id or stripeProduct.default_price was missing from the stripe product creation response.`,
        success: false
      })
    }

    const newProduct = new Product({
      creator: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        user: user?._id
      },
      // Doing this kind of thing seems pretty standard.
      // I saw it demoed in Claude AI results.
      stripeProductId: stripeProduct.id,
      stripePriceId: stripeProduct.default_price,
      name: name,
      description: description,
      //# For the moment, newly created products are getting a dummy image.
      image: product.image || '/static/images/sample.jpg',
      category: category,
      price: price,
      brand: brand,
      rating: 0, //# Ultimately, rating needs to be derived from reviews.
      stock: stock,
      reviews: []
    })

    const createdProduct = await newProduct.save()

    if (!createdProduct) {
      return res.status(500).json({
        data: null,
        message: 'Could not create product.',
        success: false
      })
    }

    return res.status(201).json({
      data: createdProduct,
      message: 'Success.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
