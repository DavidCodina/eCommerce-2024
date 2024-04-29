import { Request, Response /*, NextFunction */ } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import User from 'models/userModel'
import { getZodErrors } from 'utils'
// Brad Traversy uses express-async-handler to wrap controllers. Dave Gray prefers
// express-async-errors. For now, I prefer to manually code out all of the try/catch
// blocks myself.

import { tokenExpiration, cookieOptions } from '../../token-utils'

////////////////////////////////////////////////////////////////////////////////
//
// It's very important to use the correct status codes as discussed here:
// https://auth0.com/blog/forbidden-unauthorized-http-status-codes/
// 403 Forbidden should only be used in verifyRolesMiddleware().
// 403 might also be used if a user has authentication credentials, but
// is attempting to mutate a resource that does not belong to them.
//
// 401 Unauthorized is used in authMiddleware() and in authController's
// refreshAccessToken(). On the client, 401 (and only 401) is used to
// to refresh the accessToken from the axios interceptor.
// It does not check for 403, nor should it.
//
// Gotcha: Don't use .then() inside of a try / catch.
// In other words, don't mix .then() with async / await.
// It's possible that if you try to return a response in
// a .then() it will fire after the catch block fires, and
// this could cause an error.
//
////////////////////////////////////////////////////////////////////////////////

/* ========================================================================
                            createUser()  AKA Register user
======================================================================== */
// Originally, createUser() required phone and all shipping data.
// However, that's a lot to hit a user with when they're just signing up.
// Instead, that data is collected from within the updateUser() controller.
// Thus, a user can optionally add that info from their profile page, and it
// will subsequently expedite the checkout process.

export const createUser = async (req: Request, res: Response) => {
  const { userName, firstName, lastName, email, password, confirmPassword } =
    req.body

  try {
    /* ======================
          Validation
    ====================== */
    // In this case, we're defining the DataSchema directly within the controller.
    // This gives the schema access to the password value, so we can implement
    // the refine() confirmPassword check.

    const DataSchema = z.object({
      userName: z.string().min(1, 'A userName is required.'),

      firstName: z.string().min(1, 'A first name is required.'),

      lastName: z.string().min(1, 'A last name is required.'),

      email: z.string().email('A valid email is required'),

      password: z.string().min(5, 'Must be at least 5 characters.'),
      confirmPassword: z
        .string()
        .min(1, 'Required.')
        .refine(
          (value) => {
            return value === password
          },
          {
            message: 'The passwords must match.'
          }
        )
    })

    const validationResult = DataSchema.safeParse({
      userName,
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    })

    let errors: Record<string, string> = {}

    if ('error' in validationResult) {
      const error = validationResult.error
      if (error instanceof z.ZodError) {
        errors = getZodErrors(error.issues)
      }
    }

    ////////////////////////////////////////////////////////////////////////////////
    //
    // In the the following video at 7:00, we update this to be case insensitive.
    // In other words, we want to prohibit dAvId@example.com if david@example.com already exists.
    // https://www.youtube.com/watch?v=jEVyPJ3U_y0&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=12
    // Here's the docs for the collation method: https://www.mongodb.com/docs/manual/reference/collation/
    //
    //   const existingUser = await User.findOne({ email })
    //     .collation({ locale: 'en', strength: 2 })
    //     .lean()
    //     .exec()
    //
    // The description for strength level 2 is very cryptic. However, among other things
    // it makes checks case insensitive.
    //
    // While that's a possible solution, I don't like not knowing what else it does.
    // I've found that this also works
    //
    //   const existingUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') })
    //     .lean()
    //     .exec()
    //
    ////////////////////////////////////////////////////////////////////////////////

    if (!errors.email) {
      const existingUser = await User.findOne({
        email: new RegExp(`^${email}$`, 'i')
      })
        .lean()
        .exec()

      if (existingUser) {
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

    const hashedPassword = await bcrypt.hash(password, 10)

    //# At this point, I think the data should be used from the validationResult.
    //# Why? Zod filters out anything that is not part of the schema.

    let createdUser: any = await User.create({
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword
    })

    createdUser = createdUser.toObject()
    delete createdUser.password

    const accessToken = jwt.sign(
      {
        _id: createdUser._id
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: tokenExpiration }
    )

    // If you're ONLY using an accessToken, then there's no reason
    // to store it in the database.
    // createdUser.accessToken = accessToken
    // await createdUser.save()

    res.cookie('accessToken', accessToken, cookieOptions)

    return res.status(201).json({
      data: createdUser,
      message: 'Registration successful.',
      success: true
    })
  } catch (err) {
    if (err instanceof Error) {
      console.log({ name: err.name, message: err.message })
    } else {
      console.log(err)
    }

    return res.status(500).json({
      data: null,
      message: err instanceof Error ? err.message : 'Server error.',
      success: false
    })
  }
}
