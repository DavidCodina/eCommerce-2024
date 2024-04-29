import express from 'express'
import {
  getOrders,
  getOrder,
  updateOrderToDelivered
} from 'controllers/admin/orderController'
import authMiddleware from 'middleware/authMiddleware'
import rolesMiddleware from 'middleware/rolesMiddleware'
import { objectIdMiddleware } from 'middleware/objectIdMiddleware'

const router = express.Router()

router.get('/', authMiddleware, rolesMiddleware('admin'), getOrders)

router.patch(
  '/:id/delivered',
  objectIdMiddleware,
  authMiddleware,
  rolesMiddleware('admin'),
  updateOrderToDelivered
)

router.get(
  '/:id',
  objectIdMiddleware,
  authMiddleware,
  rolesMiddleware('admin'),
  getOrder
)

export default router
