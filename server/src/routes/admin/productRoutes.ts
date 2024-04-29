import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  softDeleteProduct
} from 'controllers/admin/productController'
import authMiddleware from 'middleware/authMiddleware'
import rolesMiddleware from 'middleware/rolesMiddleware'
import { objectIdMiddleware } from 'middleware/objectIdMiddleware'

router.route('/').get(getProducts)
router.route('/:id').get(objectIdMiddleware, getProduct)
router.post('/', authMiddleware, rolesMiddleware('admin'), createProduct)
router.patch(
  '/:id',
  objectIdMiddleware,
  authMiddleware,
  rolesMiddleware('admin'),
  updateProduct
)
router.patch(
  '/:id/soft-delete',
  objectIdMiddleware,
  authMiddleware,
  rolesMiddleware('admin'),
  softDeleteProduct
)

export default router
