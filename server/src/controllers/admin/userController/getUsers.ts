import { Request, Response } from 'express'
import User from 'models/userModel'
import { handleServerError } from 'utils'

/* ======================
      getUsers()
====================== */

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password').lean().exec()

    return res.status(200).json({
      data: users,
      message: 'Request successful.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
