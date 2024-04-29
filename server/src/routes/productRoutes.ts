import { Router } from 'express'
const router = Router()

import {
  getProducts,
  getProduct,
  getCartProducts,
  createProductReview
  // getTopProducts,
} from 'controllers/productController'
import authMiddleware from 'middleware/authMiddleware'
import { objectIdMiddleware } from 'middleware/objectIdMiddleware'

router.route('/').get(getProducts)
router.route('/:id').get(objectIdMiddleware, getProduct)
router.post('/cart', getCartProducts)

router.patch(
  '/:id/reviews',
  objectIdMiddleware,
  authMiddleware,
  createProductReview
)

export default router
