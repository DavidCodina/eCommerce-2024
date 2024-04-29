import { Request, Response } from 'express'
import User from 'models/userModel'
import { handleServerError } from 'utils'

/* ====================== 
    softDeleteUser()
====================== */

//! There is one issue to consider regarding soft deleting a user.
//! There's usually an email check in the createUser function that
//! checks for duplicate email. If the user tries to recreate an
//! account after they've been soft deleted it won't work.

export const softDeleteUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params

  try {
    const user = await User.findById(userId, '-password').exec()

    if (!user) {
      return res.status(404).json({
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    if (user.roles.includes('admin')) {
      return res.status(400).json({
        data: null,
        message:
          'Admin users can only be deactivated by the database administrator.',
        success: false
      })
    }

    user.isActive = false

    const updatedUser = await user.save()

    return res.status(200).json({
      data: updatedUser,
      message: `The user ${user.firstName} ${user.lastName}  with an 'id' of ${user._id} has been deleted.`,
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
