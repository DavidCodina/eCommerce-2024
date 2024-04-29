import { Request, Response /*, NextFunction */ } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import User from 'models/userModel'
import { getZodErrors, handleServerError } from 'utils'

/* ====================== 
      updateUser()
====================== */

export const updateUser = async (req: Request, res: Response) => {
  const userId = req?.user?._id
  const {
    userName,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    shipping
  } = req.body

  if (!shipping || typeof shipping !== 'object') {
    return res.status(400).json({
      data: null,
      message: `Shipping data is required.`,
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

      // In this case, neither password nor confirmPassword are required.
      // However, if one or the other is passed then they must match.
      // Gotcha: The safeParse() method in Zod treats undefined as a missing property, not as a value.
      // So when you’re trying to parse an object with an undefined property, Zod interprets it as if
      // the property is not present at all. Consequently, you'll still get a "Required" error even
      // if you use .nullable(). Solution: use .optional() instead.
      password: z.string().optional(),
      confirmPassword: z
        .string()
        .optional()
        .refine(
          (value) => {
            return value === password
          },
          {
            message: 'The passwords must match.'
          }
        ),

      phone: z.string().min(1, 'A phone number is required.'),
      address: z.string().min(1, 'An address is required.'),
      city: z.string().min(1, 'A city is required.'),
      state: z.string().min(1, 'A state is required.'),
      postalCode: z.string().min(1, 'A postal code is required.'),
      country: z.string().min(1, 'A country code is required.')
    })

    const validationResult = DataSchema.safeParse({
      userName,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      address,
      city,
      state,
      postalCode,
      country
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

      const notSameUser = !existingUser?._id.equals(userId)

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

    if (password && typeof password === 'string') {
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
    }

    if (phone && typeof phone === 'string') {
      user.phone = phone
    }

    user.shipping = {
      address,
      city,
      state,
      postalCode,
      country
    }

    let updatedUser: any = await user.save()

    ///////////////////////////////////////////////////////////////////////////
    //
    // At this point, it's difficult to omit fields from updatedUser
    // with projection or using .select(). We can instead do this, which
    // still feels kind of hacky.
    //
    // delete updatedUser._doc.password
    //
    // Alternatively, one could requery for the user. A slightly better approach is
    // to use the built-in toObject() method. Then do this:
    //
    //   updatedUser = updatedUser.toObject()
    //   delete updatedUser.password
    //
    // Note: You have to reassign updatedUser back onto itself. Otherwise, it won't work.
    //
    // See also:
    //
    //   https://stackoverflow.com/questions/57653175/how-to-hide-some-properties-after-receiving-result-when-saving-mongoose-object
    //   https://stackoverflow.com/questions/14196162/after-saving-an-object-using-mongoose-what-is-the-simplest-way-i-can-return-an
    //
    ///////////////////////////////////////////////////////////////////////////

    updatedUser = updatedUser.toObject()
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
