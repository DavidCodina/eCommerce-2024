import { Router } from 'express'
import {
  getCurrentUser,
  createUser,
  updateUser
} from 'controllers/userController'
import authMiddleware from 'middleware/authMiddleware'

const router = Router()
router.post('/', createUser) // AKA register
router.get('/current', authMiddleware, getCurrentUser)
router.patch('/', authMiddleware, updateUser)

export default router
