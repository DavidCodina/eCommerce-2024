// Third-party imports
import { Request, Response /*, NextFunction */ } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Custom imports
import User from 'models/userModel'
import { tokenExpiration, cookieOptions } from './token-utils'
import { handleServerError } from 'utils'

//# https://www.youtube.com/watch?v=4TtAGhr61VI&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=8
//# Video 8 at 4:30 creates a rate-limiter for the login route.
//# This is done with: npm i express-rate-limit.

/* ======================
        logIn()
====================== */

export const logIn = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      data: null,
      message: 'Please enter all fields (Server).',
      success: false
    })
  }

  try {
    // The exec() function is used in Mongoose to execute a query. However, when you’re using
    //await with Mongoose queries, you don’t necessarily need to use exec(). The await keyword
    // will automatically resolve the promise returned by findOne().
    // Dont' call .lean() because we will be using .save() on existingUser.
    let existingUser = await User.findOne({ email }).exec()

    if (!existingUser) {
      return res.status(400).json({
        data: null,
        message: 'Invalid credentials. (1)', // Technically "email not found", but be opaque.
        success: false
      })
    }

    // Compare plain text password that was sent in req.body to the hashed
    // password in the database (that corresponds to the associated email).
    // Validate password with bcrypt (bcryptjs actually).
    const isMatch = await bcrypt.compare(password, existingUser.password)

    if (!isMatch) {
      return res.status(400).json({
        data: null,
        message: 'Invalid credentials. (2)', // Technically "bad password", but be opaque.
        success: false
      })
    }

    // Create accessToken
    const accessToken = jwt.sign(
      {
        // Mongoose uses an abstraction, so technically, we could use existingUser.id
        _id: existingUser._id
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: tokenExpiration }
    )

    //# The whole point of JWTs is that they're stateless.
    //# That said, even with a single accessToken, we could
    //# store it in the database then in the authMiddleware check
    //# that the token also exists in the database.
    //# This allows for a mechanism whereby it could essentially
    //# be revoked merely by manually deleting it from the database.
    //# The way that this would work is by checking the iat of the
    //# accessToken in the database against the iat in the cookie token.
    //# The only downside here is that a similar procedure would need to
    //# be implemented across all servers that accept such a token.
    //# Ultimately, you don't want to be doing this, but it's better than nothing.

    // If you're ONLY using an accessToken, then there's no reason
    // to store it in the database.
    // existingUser.accessToken = accessToken
    // await existingUser.save()
    res.cookie('accessToken', accessToken, cookieOptions)

    existingUser = existingUser.toObject()
    delete (existingUser as any).password

    return res.status(200).json({
      data: existingUser,
      message: 'Login success.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}

/* ======================
        logOut()
====================== */
// The purpose of logOut() is to remove the cookie/accessToken.

export const logOut = async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies.accessToken) {
    // The Dave Gray tutorial used 204 for 'No Content'.
    // The problem with that approach is that no JSON will be returned.
    return res.status(200).json({
      data: null,
      message:
        "The logout request could not find the 'accessToken' cookie, but that's okay.",
      success: true
    })
  }

  // https://www.youtube.com/watch?v=4TtAGhr61VI&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=10
  // Dave Gray mentions at 23:10 that you have to pass in all of the same options when clearing the cookie.
  // The cookie options MUST MATCH those that it was originally sent with!
  // Regardless of whether or not we find an existingUser, we want to clear the cookie.
  // Some people instead do:
  // res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0) })
  res.clearCookie('accessToken', cookieOptions)

  try {
    return res.status(200).json({
      data: null,
      message: 'Log out successful.',
      success: true
    })
  } catch (err) {
    return handleServerError(res, err)
  }
}
