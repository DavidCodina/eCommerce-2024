import { Request, Response /*, NextFunction */ } from 'express'
import User from 'models/userModel'
import { handleServerError } from 'utils'

/* ======================
    getCurrentUser()
====================== */
////////////////////////////////////////////////////////////////////////////////
//
// The regular getUser() is intended for use in any site that needs
// to access a single user. getCurrentUser() is a little different.
// It's intended for accessing ONLY the current user.
//
// This may be useful in cases where data passed back in the current user object
// needs to be more detailed (i.e., + sensitive data) than the general getUser() exposes.
// That said, there's still no reason why we need to include password, refreshToken, or roles.
//
////////////////////////////////////////////////////////////////////////////////

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.user?._id

  try {
    const user = await User.findById(userId, '-password').lean().exec()

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
