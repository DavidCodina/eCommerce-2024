import { Router } from 'express'
import {
  getUsers,
  getUser,
  updateUser,
  softDeleteUser,
  hardDeleteUser
} from 'controllers/admin/userController'

import authMiddleware from 'middleware/authMiddleware'
import rolesMiddleware from 'middleware/rolesMiddleware'
import { objectIdMiddleware } from 'middleware/objectIdMiddleware'

const router = Router()

/* ======================
        admin
====================== */

router.get('/', authMiddleware, rolesMiddleware('admin'), getUsers)

router.get(
  '/:id',
  objectIdMiddleware,
  authMiddleware,
  rolesMiddleware('admin'),
  getUser
)

router.patch(
  '/:id',
  objectIdMiddleware,
  authMiddleware,
  rolesMiddleware('admin'),
  updateUser
)

router.patch(
  '/:id/soft-delete',
  objectIdMiddleware,
  authMiddleware,
  rolesMiddleware('admin'),
  softDeleteUser
)

router.delete(
  '/:id/hard-delete',
  objectIdMiddleware,
  authMiddleware,
  rolesMiddleware('admin'),
  hardDeleteUser
)

export default router
