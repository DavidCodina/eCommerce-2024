import { Request, Response /*, NextFunction */ } from 'express'
import Order from 'models/orderModel'
import { handleServerError } from 'utils'

/* ======================
        getOrder()
====================== */
// Used by PageOrder (i.e., details) on the client.

export const getOrder = async (req: Request, res: Response) => {
  const userId = req.user?._id
  const orderId = req.params?.id

  try {
    // If the user property is not present in the order document, Mongoose will not throw an error.
    // Instead, it will populate the user field with null if the referenced document does not exist.
    const order = await Order.findById(orderId).populate(
      'user',
      '_id name email phone'
    )

    if (!order) {
      return res.status(400).json({
        data: null,
        message: `Order not found.`,
        success: false
      })
    }

    if (!order.user) {
      return res.status(400).json({
        data: null,
        message: `The order has no user. Owner authorization could not be determined.`,
        success: false
      })
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Owner Authorization Check:
    //
    // 403 is actually the correct status code because the user does have
    // authetication credentials, but those credentials do not authorize them
    // to interact with this resource.
    //
    // https://auth0.com/blog/forbidden-unauthorized-http-status-codes/
    //
    ///////////////////////////////////////////////////////////////////////////

    // You could do this: order.user._id.toString() !== userId?.toString()
    // However, if you're using Mongoose the preferred approach is to use .equals()
    // It’s safer because it won’t throw an error if one of the ids is null or undefined.
    // Instead, it will correctly return false.
    const isEqual = order.user._id.equals(userId)

    if (!isEqual) {
      return res.status(403).json({
        data: null,
        message: 'Only the resource owner may make this request.',
        success: false
      })
    }

    return res.status(200).json({
      data: order,
      message: 'Success.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/* ======================
    deleteOrder()
====================== */

//# This will only be allowed when paymentStatus === "unpaid"
//# This will be used when a guest user is on '/orders/:id' and
//# chooses to "Continue Shopping". The guest user flow deletes
//# the order (while maintaining the client-side cart), then
//# redirects '/store'
