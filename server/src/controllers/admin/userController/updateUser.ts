import { Request, Response } from 'express'
import { z } from 'zod'
import User from 'models/userModel'
import { getZodErrors, handleServerError } from 'utils'

function isRolesArray(arr: any[]): arr is ('user' | 'manager' | 'admin')[] {
  const validRoles = ['user', 'manager', 'admin']
  return (
    Array.isArray(arr) &&
    arr.every((role) => {
      return typeof role === 'string' && validRoles.includes(role)
    })
  )
}

/* ====================== 
      updateUser()
====================== */
// The admin version differs from the user version in that an admin
// provides the id through req.params. Also password and image updating
// is omitted.

export const updateUser = async (req: Request, res: Response) => {
  const { id: userId } = req.params
  const {
    userName,
    firstName,
    lastName,
    email,
    phone,
    shipping,
    roles,
    isActive
  } = req.body

  if (!shipping || typeof shipping !== 'object') {
    return res.status(404).json({
      data: null,
      message: `'shipping' data is required.`,
      success: false
    })
  }

  const { address, city, state, postalCode, country } = shipping

  try {
    const user = await User.findById(userId).exec()

    if (!user) {
      return res.status(404).json({
        data: null,
        message: 'Resource not found.',
        success: false
      })
    }

    /* ======================
          Validation
    ====================== */

    const DataSchema = z.object({
      userName: z.string().min(1, 'A userName is required.'),
      firstName: z.string().min(1, 'A first name is required.'),
      lastName: z.string().min(1, 'A last name is required.'),
      email: z.string().email('A valid email is required.'),
      phone: z.string().min(1, 'A phone number is required.'),

      address: z.string().min(1, 'An address is required.'),
      city: z.string().min(1, 'A city is required.'),
      state: z.string().min(1, 'A state is required.'),
      postalCode: z.string().min(1, 'A postal code is required.'),
      country: z.string().min(1, 'A country code is required.'),

      isActive: z
        .boolean({
          required_error: 'isActive is required.',
          invalid_type_error: 'isActive must be a boolean'
        })
        .refine(
          (value) => {
            if (value === false && user.roles?.includes('admin')) {
              return false
            }
            return true
          },
          {
            message:
              'Admin users can only be deactivated by the database administrator.'
          }
        ),

      roles: z
        .array(z.string())
        .refine((value) => value.includes('user'), {
          message: "The 'user' role is required."
        })

        .refine((value) => isRolesArray(value), {
          message: 'The roles array contains one or more invalid values.'
        })
    })

    const validationResult = DataSchema.safeParse({
      userName,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      isActive,
      roles
    })

    let errors: Record<string, string> = {}

    if ('error' in validationResult) {
      const error = validationResult.error
      if (error instanceof z.ZodError) {
        errors = getZodErrors(error.issues)
      }
    }

    if (!errors.email) {
      const existingUser = await User.findOne({
        email: new RegExp(`^${email}$`, 'i')
      })
        .lean()
        .exec()

      const notSameUser = !existingUser?._id.equals(user._id)

      if (existingUser && notSameUser) {
        errors.email = 'A user with that email already exists. (Server)' // 409 Conflict error
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        data: null,
        errors: errors,
        message: 'The form data is invalid.',
        success: false
      })
    }

    /* ======================

    ====================== */
    //# At this point, I think the data should be used from the validationResult.
    //# Why? Zod filters out anything that is not part of the schema.

    if (userName && typeof userName === 'string') {
      user.userName = userName
    }

    if (firstName && typeof firstName === 'string') {
      user.firstName = firstName
    }

    if (lastName && typeof lastName === 'string') {
      user.lastName = lastName
    }

    if (email && typeof email === 'string') {
      user.email = email
    }

    if (phone && typeof phone === 'string') {
      user.phone = phone
    }

    if (Array.isArray(roles)) {
      user.roles = roles
    }

    user.shipping = {
      address,
      city,
      state,
      postalCode,
      country
    }

    if (typeof isActive === 'boolean') {
      user.isActive = isActive
    }

    let updatedUser: any = await user.save()

    updatedUser = updatedUser.toObject()
    // There's no need to send roles or refreshToken. If the client wants
    // roles, they should always use the decoded accessToken.
    delete updatedUser.password

    return res.status(200).json({
      // Whatever is returned here should always match what is returned by
      // getCurrentUser(). Why? Because the client could be using response
      // data to update the client state for the current user.
      data: updatedUser,
      message: 'Resource updated.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
