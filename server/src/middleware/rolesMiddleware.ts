import { Request, Response, NextFunction } from 'express'

/* ========================================================================
                            rolesMiddleware()           
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Example usage:
//
// app.get('/api/admin', authMiddleware, rolesMiddleware('admin'), async (req, res) => {
//     return res.status(200).json({
//       data: {}, message: 'You accessed the admin route.', success: true })
//   }
// )
//
///////////////////////////////////////////////////////////////////////////

const rolesMiddleware = (...allowedRoles: Roles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const roles = req.user?.roles

    let hasRole = false

    if (!roles) {
      // https://auth0.com/blog/forbidden-unauthorized-http-status-codes/
      // 400 Bad Request is the status code to return when the form of the
      // client request is not as the API expects.
      return res.status(400).json({
        data: null,
        message: 'The sent accessToken did not have roles (Bad Request).',
        success: false
      })
    }

    for (let i = 0; i < allowedRoles.length; i++) {
      const allowedRole = allowedRoles[i]
      if (roles.includes(allowedRole)) {
        hasRole = true
        break
      }
    }

    if (!hasRole) {
      // https://auth0.com/blog/forbidden-unauthorized-http-status-codes/
      // 403 Forbidden is the status code to return when a client has valid credentials,
      // but not enough privileges to perform an action on a resource.
      return res.status(403).json({
        data: null,
        message:
          'The user lacks the requisite permission for this request (Forbidden).',
        success: false
      })
    }

    // Otherwise continue to the next middleware (or route controller).
    next()
  }
}

export default rolesMiddleware
