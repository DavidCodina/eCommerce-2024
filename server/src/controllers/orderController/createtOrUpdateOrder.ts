import { Request, Response /*, NextFunction */ } from 'express'
import { z } from 'zod'

import Order from 'models/orderModel'
import Product from 'models/productModel'
import { getZodErrors } from 'utils'
import { handleServerError } from 'utils'

/* =============================================================================
                            createOrUpdateOrder()            
============================================================================= */

export const createOrUpdateOrder = async (req: Request, res: Response) => {
  const { orderId, cartItems, customer, shipping } = req.body
  const user = req.user

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({
      data: null,
      message: 'cartItems required.',
      success: false
    })
  }

  if (!customer || typeof customer !== 'object') {
    return res.status(400).json({
      data: null,
      message: 'Customer required.',
      success: false
    })
  }

  if (!shipping || typeof shipping !== 'object') {
    return res.status(400).json({
      data: null,
      message: 'Shipping required.',
      success: false
    })
  }

  const { firstName, lastName, email, phone } = customer
  const { address, city, state, postalCode, country } = shipping

  /* ======================
          Validation
  ====================== */

  const DataSchema = z.object({
    firstName: z.string().min(1, 'A first name is required.'),
    lastName: z.string().min(1, 'A last name is required.'),
    email: z.string().email('A valid email is required.'),
    phone: z.string().min(1, 'A phone number is required.'),

    address: z.string().min(1, 'An address is required.'),
    city: z.string().min(1, 'A city is required.'),
    state: z.string().min(1, 'A state is required.'),
    postalCode: z.string().min(1, 'A postal code is required.'),
    country: z.string().min(1, 'A country code is required.')
  })

  const validationResult = DataSchema.safeParse({
    firstName,
    lastName,
    email,
    phone,

    address,
    city,
    state,
    postalCode,
    country
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

  ///////////////////////////////////////////////////////////////////////////
  //
  // Get the price from the database even if it's provided by the client.
  // We must only trust the price that exists in the database.
  // This prevents a user paying whatever they want by hacking our client
  // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff
  //
  ///////////////////////////////////////////////////////////////////////////

  try {
    // Get the ordered products from database.
    const productIds = cartItems.map((item: any) => item.id)
    const products = await Product.find({
      _id: { $in: productIds }
    })

    //# Check that their are products and that the lengths are the same as cartItems.

    // Map over cartItems and use the price from database products.
    const orderItems = cartItems.map((cartItem: any) => {
      const product = products.find((p) => p._id.toString() === cartItem.id)
      return {
        name: product!.name,
        quantity: cartItem.quantity,
        product: cartItem.id,
        price: product!.price
      }
    })

    /* ======================
         Calculate Prices
    ====================== */

    // subtotal equals the sum of each (item * quantity).
    // Calculate the items price in whole number (pennies) to
    // avoid issues with floating point number calculations
    const subtotal = orderItems.reduce(
      (acc: any, orderItem: any) =>
        acc + (orderItem.price * 100 * orderItem.quantity) / 100,
      0
    )

    // This is mocked out for now, but ultimately you want ot use UPS,FedEx, USPS SDKs.
    const shippingCost = 15
    const taxRate = 0.15

    // Again, this is mocked out for now.
    // Most states and tax jurisdictions consider shipping charges as part of the overall taxable transaction value.
    // However, there are a few exceptions where certain states or localities exempt shipping charges from sales tax
    // calculations. For example, in New York, shipping charges for deliveries originating from outside the state are
    // exempt from sales tax.

    let tax = (subtotal + shippingCost) * taxRate
    tax = Math.round(tax * 100) / 100
    const total = subtotal + shippingCost + tax

    /* ======================
          Update Order 
    ====================== */
    //# At this point, I think the data should be used from the validationResult.
    //# Why? Zod filters out anything that is not part of the schema.

    if (orderId && typeof orderId === 'string') {
      const existingOrder = await Order.findById(orderId)

      //# Validate orderId is ObjectId

      // Check if order exists
      if (!existingOrder) {
        return res.status(404).json({
          data: null,
          message: `Resource not found.`,
          success: false
        })
      }

      //# Check if order is paid. Paid orders cannot be updated.

      //# Check existingOrder._id against user._id for owner authorization...

      existingOrder.orderItems = orderItems
      existingOrder.customer = customer
      existingOrder.shipping = shipping
      existingOrder.subtotal = subtotal
      existingOrder.shippingCost = shippingCost
      existingOrder.tax = tax
      existingOrder.total = total

      const updatedOrder = await existingOrder.save()

      return res.status(200).json({
        data: updatedOrder,
        message: 'Order updated.',
        success: true
      })
    }

    /* ======================
         Create Order 
    ====================== */
    //# At this point, I think the data should be used from the validationResult.
    //# Why? Zod filters out anything that is not part of the schema.

    const order = new Order({
      ...(user && user._id ? { user: user._id } : {}),
      orderItems,
      customer: customer,
      shipping: shipping,
      subtotal,
      shippingCost,
      tax,
      total
    })

    const createdOrder = await order.save()

    return res.status(201).json({
      data: createdOrder,
      message: 'Order created.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
