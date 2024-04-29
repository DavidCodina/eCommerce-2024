import { Request, Response /*, NextFunction */ } from 'express'
import { stripe } from 'utils/stripe'
import Order from 'models/orderModel'
import { handleServerError } from 'utils'

/* ======================
updateOrderPaymentStatus
====================== */
//# Rename specifically to updateOrderToPaid()

//# Also, once the order has been confirmed as paid, we probably want to reduce
//# the associated stock by the amount ordered.
//# See here at 2:25:45 : https://www.youtube.com/watch?v=XnbUHzZkypQ&t=247s
//# He uses updateMany()

///////////////////////////////////////////////////////////////////////////
//
// When a Stripe session is created in createOrder(), there's a payment_status: 'unpaid' property.
// The createOrder() controller sends back ?orderId=... on Stripe's success_url. Then the
// React '/success' page makes a call to '/update-payment-status/:id' with the orderId.
// That orderId is used here to find the order document, get the stripeSessionId, call
// stripe, get the current payment_status, then update the database order with the potentially
// new value.
//
// While this approach works, it's not the most foolproof method. Why?
// Because it depends on the client to trigger the update. Stripe webhooks
// are a more secure and scalable approach. Webhooks are the recommended way to handle
// asynchronous events like payment confirmations.
//
///////////////////////////////////////////////////////////////////////////

export const updateOrderPaymentStatus = async (req: Request, res: Response) => {
  const orderId = req.params.id

  if (!orderId) {
    return res.status(400).json({
      data: null,
      message: `Missing 'id' of order.`,
      success: false
    })
  }

  try {
    let order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        data: null,
        message: `Order not found.`,
        success: false
      })
    }

    if (order.isPaid === true) {
      return res.status(409).json({
        data: null,
        message: `The order has already been paid.`,
        success: false
      })
    }

    const stripeSessionId = order.stripeSessionId

    if (!stripeSessionId) {
      return res.status(404).json({
        data: null,
        message: `'stripeSessionId' not found on order.`,
        success: false
      })
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(
      stripeSessionId
    )

    if (!stripeSession) {
      return res.status(404).json({
        data: null,
        message: `'stripeSession' not found.`,
        success: false
      })
    }

    // The stripeSession doesn't seem to expose a payment_date property,
    // so it seems it's up to us to set it.

    //# However, the intention of this endpoint is specifically to update
    //# from isPaid:false to isPaid:true. Consequently, we need to check the
    //# order here to makesure it's not yet paid. Otherwise, the order's
    //# paidAt date will continue to change if the endpoint is triggered again.

    if (
      typeof stripeSession?.payment_status === 'string' &&
      stripeSession.payment_status === 'paid'
    ) {
      order = await Order.findByIdAndUpdate(
        orderId,
        {
          isPaid: true,
          paidAt: new Date()
        },
        { new: true }
      )
    }

    return res.status(200).json({
      // Do NOT send back the order. Why? Because this is a public GET request.
      // There's no harm in triggering it, but we definitely don't want to send
      // anything back.
      data: null,
      message: 'Order payment status updated.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
