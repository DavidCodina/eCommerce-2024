import { Request, Response /*, NextFunction */ } from 'express'
import Order from 'models/orderModel'
import { handleServerError } from 'utils'

/* ======================
      getOrders()
====================== */
//# Implement sortBy, orderBy, filterBy logic like what's done in the admin version.
//# Also implement pagination.

export const getOrders = async (req: Request, res: Response) => {
  const userId = req.user?._id

  try {
    const orders = await Order.find({ user: userId })

    // Will return an empty array, so this will likely not occur.
    if (!orders) {
      return res.status(400).json({
        data: null,
        message: `Resource not found.`,
        success: false
      })
    }

    return res.status(200).json({
      data: orders,
      message: `Success.`,
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
