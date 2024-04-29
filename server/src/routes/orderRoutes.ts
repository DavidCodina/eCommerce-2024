import express from 'express'
const router = express.Router()
import {
  createOrUpdateOrder,
  getOrders,
  getOrder,
  payOrder,
  updateOrderPaymentStatus
} from 'controllers/orderController'
import userMiddleware from 'middleware/userMiddleware'
import authMiddleware from 'middleware/authMiddleware'

import { objectIdMiddleware } from 'middleware/objectIdMiddleware'

router.post('/', userMiddleware, createOrUpdateOrder)
router.get('/', authMiddleware, getOrders)

router.get('/:id', objectIdMiddleware, authMiddleware, getOrder)

// In theory, someone could spam this endpoint, but it wouldn't really accomplish anything.
router.post('/pay', payOrder)

router.patch(
  '/update-payment-status/:id',
  objectIdMiddleware,
  updateOrderPaymentStatus
)

export default router
