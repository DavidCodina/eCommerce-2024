import { Request, Response /*, NextFunction */ } from 'express'
import User from 'models/userModel'
import { handleServerError } from 'utils'

/* ====================== 
      deleteUser()
====================== */
//# This is for the user to delete themself.

//# This is currently not being used, but would be available in the user's profile
//# page.  Rather than actually deleting a user, we may choose to soft delete them.
//# that way we can keep the reference to them. This would entail.
//# preventing login on the client if !isActive.

//# Ideally, there should be a check to see if the user to be deleted is an admin.
//# Then check to see how many admins there are. If there's only one, then this means
//# we'd be deleting the only admin. This should not be allowed.

//! Note for if/when you soft delete user:
//! There is one issue to consider regarding soft deleting a user.
//! There's usually an email check in the createUser function that
//! checks for duplicate email. If the user tries to recreate an
//! account after they've been soft deleted it won't work.

export const _deleteUser = async (req: Request, res: Response) => {
  const userId = req?.user?._id

  try {
    const user = await User.findById(userId, '-password -roles').exec()

    if (!user) {
      return res.status(404).json({
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Delete associated user resources first.
    //
    // Here I'm handling the delete cascade directly within the controller.
    // However, I've also seen others use the .pre('remove') hook in
    // the Model perform this kind of operation:
    //
    // Stephen Grider does that here:
    //
    //   https://www.udemy.com/course/the-complete-developers-guide-to-mongodb/learn/lecture/6035632#overview
    //   https://www.udemy.com/course/the-complete-developers-guide-to-mongodb/learn/lecture/6035636#overview
    //
    ///////////////////////////////////////////////////////////////////////////

    //! Test this.............
    //! await Note.deleteMany({ user: userId })

    const _deletedUser = await user.deleteOne()

    return res.status(200).json({
      data: user, // Or just send back null
      message: `The user ${user.firstName} ${user.lastName} with an 'id' of ${user._id} has been deleted.`,
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
