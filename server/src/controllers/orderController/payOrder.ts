import { Request, Response /*, NextFunction */ } from 'express'
import { stripe } from 'utils/stripe'
import Order from 'models/orderModel'
import { handleServerError } from 'utils'

/* ======================
        payOrder()
====================== */

export const payOrder = async (req: Request, res: Response) => {
  // In this case, the orderId is passed through req.body, rather than
  // exposed as a req.param. This way we can avoid potential malicious
  // attempts at interfering with Stripe payments.

  const { orderId } = req.body

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({
      data: null,
      message: `orderId not found.`,
      success: false
    })
  }

  //# Validate orderId is ObjectId.

  try {
    const order = await Order.findById(orderId).populate('orderItems.product') //# exec() ???

    if (!order) {
      return res.status(404).json({
        data: null,
        message: `Order not found.`,
        success: false
      })
    }

    // Make sure the order isn't already paid.
    if (order.isPaid === true) {
      return res.status(409).json({
        data: null,
        message: `The order has already been paid.`,
        success: false
      })
    }

    const orderItems = order.orderItems

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        data: null,
        message: `There are no items in this order.`,
        success: false
      })
    }

    /* ======================

    ====================== */

    //# Check actual order quantities against stock...

    /* ======================
      Create Stripe Session
    ====================== */

    // items (i.e., cartItems) will be an array of objects with { id: <string>, quantity: <number> }
    let lineItems: Record<string, any>[] = []

    orderItems.forEach((item: any) => {
      // const product = products.find((p: any) => p._id.toString() === item.id)
      const product = item.product
      const { stripePriceId } = product

      //# validate that their is a product AND product.stripePriceId.
      //# If not, push an error to an array outside of the forEach
      //# Then return early with a 400 before creating the session.

      ///////////////////////////////////////////////////////////////////////////
      //
      // Note: an indeterminate amount of time has passed since the order was
      // initially created. The initial item price, subtotal, shipping, tax and
      // total could all have potentially changed between the time the order was
      // created and the time the user pays for the order. Thus the information contained
      // in the order document may be inaccurate. It's extremely important that we have
      // the most up-to-date data in the order document prior to creating a stripe session.
      //
      // Ultimately, this necessitates a complete reevaluation and recalculation of all item prices,
      // subtotal, shippingCost, tax, and total IMMEDIATELY PRIOR TO GENERATING the stripe session.
      // In other words, we need to update the order document so that everything is fresh and up to date.
      //
      //^ That said, I am not currently doing that in this demo.
      //
      ///////////////////////////////////////////////////////////////////////////

      lineItems.push({
        price: stripePriceId,
        quantity: item.quantity
      })
    })

    lineItems = [
      ...lineItems,
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping'
          },
          unit_amount: order.shippingCost * 100
        },
        quantity: 1
      },
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax'
          },
          unit_amount: order.tax * 100
        },
        quantity: 1
      }
    ]

    // https://docs.stripe.com/api/checkout/sessions
    // Stripe Checkout Sessions have a default expiration time of 24 hours.
    // This means after creating a session using stripe.checkout.sessions.create(),
    // a customer has 24 hours to complete the payment process through the provided Checkout URL.
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      // Or use req.heaaders.origin + '/success' & req.headers.origin + '/cancel'
      // Note that when a user checks out, an email is automatically sent to them.
      success_url: `http://localhost:3000/success?orderId=${orderId}`, // Obviously, change this for production
      cancel_url: 'http://localhost:3000/cancel' // Obviously, change this for production
      // payment_method_types: ['card']
    })

    //# Check for session.id

    // Update the order with the stripeSessionId
    /* const updatedOrder = */ await Order.findByIdAndUpdate(
      orderId,
      { stripeSessionId: session.id },
      { new: true }
    )

    /* ======================
           Response
    ====================== */

    return res.status(200).json({
      data: session.url,
      message: 'Success.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
