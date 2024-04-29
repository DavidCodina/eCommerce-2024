import { Request, Response } from 'express'
import User from 'models/userModel'
import { handleServerError } from 'utils'

/* ====================== 
      hardDeleteUser()
====================== */

export const hardDeleteUser = async (req: Request, res: Response) => {
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
          'Admin users can only be deleted by the database administrator.',
        success: false
      })
    }

    await user.deleteOne() // => { acknowledged: true, deletedCount: 1 }

    return res.status(200).json({
      data: user, // Or just send back null
      message: `The user ${user.firstName} ${user.lastName} with an 'id' of ${user._id} has been deleted.`,
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
