import { Request, Response } from 'express'
import User from 'models/userModel'
import { handleServerError } from 'utils'

/* ======================
        getUser()
====================== */

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params

  // This is really not necessary.
  if (!id) {
    return res.status(400).json({
      data: null,
      message: "The resource 'id' is required.",
      success: false
    })
  }

  try {
    const user = await User.findById(id, '-password').lean().exec()

    if (!user) {
      return res.status(404).json({
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    return res.status(200).json({
      data: user,
      message: 'Request successful.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
