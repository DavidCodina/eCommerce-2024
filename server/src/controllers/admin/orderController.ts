import { Request, Response /*, NextFunction */ } from 'express'
import Order from 'models/orderModel'
import { handleServerError } from 'utils'

/* ======================
        getOrders()
====================== */
//# Implement pagination.

//# We could also create a populate query search param.

export const getOrders = async (req: Request, res: Response) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // MongoDB does not apply any default sorting to the documents returned from a query. The order of documents
  // returned is the natural order which reflects the order in which documents are stored in the database, which
  // may be influenced by the insertion order and the MongoDB storage engine.
  // If you need the documents to be returned in a specific order, you should always use the sort() function
  // and specify the default sorting criteria.
  //
  // 1 is smallest first ('asc'). In regard to ISO dates, the
  // smallest date is the oldest. Why? Because as a timestamp its the smallest.
  // -1 is the largest first ('desc').  In regard to ISO dates, the
  // largest date is the newest because it's the largest timestamp.
  //
  ///////////////////////////////////////////////////////////////////////////

  const { sortBy = 'desc', orderBy = 'createdAt', filterBy, select } = req.query
  const sortByValue = sortBy === 'desc' ? -1 : 1

  try {
    let query = Order.find()

    ///////////////////////////////////////////////////////////////////////////
    //
    // If there are no orders or 0 orders, we don't need return a 404.
    // Conceptually, it might be acceptable that there are no orders.
    // MongoDB will return an empty result set ([]), so !orders will actually
    // never even occur.
    //
    //   if (!orders) {
    //     return res.status(404).json({ data: null, message: `Resource not found.`,  success: false })
    //   }
    //
    ///////////////////////////////////////////////////////////////////////////

    // Example: /api/admin/orders?select=_id,total,paymentStatus
    if (select && typeof select === 'string') {
      const formattedSelect = select.split(',').join(' ')
      query.select(formattedSelect)
    }

    if (filterBy && typeof filterBy === 'string') {
      ///////////////////////////////////////////////////////////////////////////
      //
      // filterBy is expected to be a comma-separated list of key-value pairs, where
      // each pair is separated by a colon. For example:
      //
      //-   ?filterBy=paymentStatus:unpaid,_id:660af7fe224f6219849e2e9a
      //
      // Note: ?filterBy=tax:317.25 will also work. Even though tax in the database
      // is actually a number, '317.25' gets typecast by Mongoose. The same goes
      // for 'true'|'false' being typecast to true|false.
      //
      // The code then splits this string into an object and uses it to filter the orders.
      // The ":" may need to be URL encoded (i.e., percent-encoded) to %3A.
      // That said, it worked fine from Postman.
      //
      // In many cases, modern web servers and applications can handle special characters
      // like ":" in the query string without any issues, even if they are not percent-encoded.
      // This is because these characters are generally safe in the query string part of a URL.
      //
      ///////////////////////////////////////////////////////////////////////////
      const filters = filterBy.split(',').reduce((acc, filter) => {
        const [key, value] = filter.split(':')
        return { ...acc, [key]: value }
      }, {})

      query = query.find(filters)
    }

    //# What about multi-sort.
    //# Also how would we sort by paymentStatus: 'paid' vs everything else?
    //# Ask AI.
    if (orderBy && typeof orderBy === 'string') {
      // Newest orders first: /api/admin/orders?orderBy=createdAt&sortBy=desc
      query = query.sort({ [orderBy]: sortByValue })
    }

    const orders = await query.exec()

    return res.status(200).json({
      data: orders,
      message: `Success.`,
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/* ======================
        getOrder()
====================== */
// In the admin version, there does not need to be an associated user
// in the order. Nor is the an owner authorization check.

export const getOrder = async (req: Request, res: Response) => {
  const orderId = req.params?.id

  // Not really necessary as this endpoint wouldn't get called without an :id.
  if (!orderId) {
    return res.status(400).json({
      data: null,
      message: `The order '_id' must be provided.`,
      success: false
    })
  }

  try {
    const order = await Order.findById(orderId).populate('user', '-password')

    if (!order) {
      return res.status(400).json({
        data: null,
        message: `Order not found.`,
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
updateOrderToDelivered()
====================== */

export const updateOrderToDelivered = async (req: Request, res: Response) => {
  const orderId = req.params.id

  // Not really necessary as this endpoint wouldn't get called without an :id.
  if (!orderId) {
    return res.status(400).json({
      data: null,
      message: `The order '_id' must be provided.`,
      success: false
    })
  }

  try {
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        data: null,
        message: `Order not found.`,
        success: false
      })
    }

    if (order.isDelivered === true) {
      const deliveredAt: any = order.deliveredAt

      const formattedDeliveredAt =
        deliveredAt instanceof Date
          ? new Date(deliveredAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : null

      const message = formattedDeliveredAt
        ? `The order was already marked as delivered on ${formattedDeliveredAt}.`
        : `The order was already marked as delivered.`

      return res.status(409).json({
        data: null,
        message: message,
        success: false
      })
    }

    order.isDelivered = true

    // Obviously, the delivery date may be not be Date.now()
    // when the admin goes to update it, so for a production app
    // we would definitely want to enable the admin to set the actual date.

    // Notiice also that Dat.now() or new Date() both work.
    order.deliveredAt = Date.now().toString()
    const updatedOrder = await order.save()

    return res.status(200).json({
      data: updatedOrder,
      message: 'Order updated as delivered.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
