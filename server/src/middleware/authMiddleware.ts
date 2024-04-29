import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from 'models/userModel'

/* ========================================================================
                            authMiddleware()           
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Example usage:
//
// app.get('/api/protected', authMiddleware, async (req, res) => {
//   return res.status(200).json({ data: {}, message: 'You accessed the protected route.', success: true })
// })
//
///////////////////////////////////////////////////////////////////////////

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken

  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(401).json({
      data: null,
      message: 'No accessToken. Authentication failed.',
      success: false
    })
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET!,
    async (err, decoded) => {
      if (err) {
        console.log(err)

        ///////////////////////////////////////////////////////////////////////////
        //
        // https://auth0.com/blog/forbidden-unauthorized-http-status-codes/
        // 401 Unauthorized is the status code to return when the client
        // provides no credentials or invalid credentials.
        //
        // Dave Gray uses 403 at 26:25 of https://www.youtube.com/watch?v=4TtAGhr61VI&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=10
        // I think that is incorrect.
        //
        ///////////////////////////////////////////////////////////////////////////
        return res.status(401).json({
          data: null,
          message: "The 'accessToken' is invalid.",
          success: false
        })
      }

      ///////////////////////////////////////////////////////////////////////////
      //
      // The naive approach would be to attach decoded to req.user.
      //
      //  req.user = decoded as Request['user']
      //
      // However, if a user updated their info then the data from decoded could be stale
      // until the next time the user logged in. For this reason, it's a better practice
      // to use the decoded._id to get the user directly from the database every time.
      //
      ///////////////////////////////////////////////////////////////////////////

      if (decoded && typeof decoded === 'object' && '_id' in decoded) {
        const userId = decoded._id
        const user = await User.findById(userId, '-password').lean().exec()

        if (!user) {
          return res.status(401).json({
            data: null,
            message: 'Authentication failed: unable to find user.',
            success: false
          })
        }

        req.user = user
      } else {
        return res.status(401).json({
          data: null,
          message: 'Authentication failed: data missing from decoded cookie.',
          success: false
        })
      }
      next()
    }
  )
}

export default authMiddleware
