import { Router } from 'express'
import { logIn, logOut } from 'controllers/authController'

const router = Router()

router.post('/login', logIn)
router.post('/logout', logOut)

export default router
