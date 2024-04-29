import jwt from 'jsonwebtoken'

type RefreshTokenData = {
  exp: number
  iat: number
  id: string
}

/* ======================
      constants
====================== */
// '1d', '30s', etc.

export const tokenExpiration = '1d'
// export const accessTokenExpiration = '1d' // In production set it to something like 5 - 15 minutes.
// export const refreshTokenExpiration = '1d' // In production set it to something  like 1d to 2 weeks.
const cookieMaxAge = 24 * 60 * 60 * 1000 // Notice how this matches tokenExpiration

export const cookieOptions = {
  httpOnly: true, // Accessible only by the web server.
  maxAge: cookieMaxAge,

  //domain?: string | undefined;
  // domain: 'http://localhost',
  // https://www.youtube.com/watch?v=4TtAGhr61VI&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=8
  // Dave Gray uses sameSite:'None' in the tutorial at 19:00, but this seems to break the implementation for me.
  // This should allow cross-site cookies.
  // sameSite: 'None'
  // The tutorial does this, but I don't seem to need it.
  // This should limit to only https.
  // You would want this in production, but it may cause issues during development.
  // This is alluded to briefly in the following Dave Gray tutorial at 31:10
  // https://www.youtube.com/watch?v=4TtAGhr61VI&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=11
  secure: process.env.NODE_ENV === 'development' ? false : true

  //# sameSite: 'strict' // Brad does this
  //sameSite: 'none'
}

/* ======================
  decodeRefreshtoken()
====================== */
// A helper function to quickly decode the refreshToken

export const decodeRefreshtoken = async (refreshToken: string) => {
  try {
    const decoded = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    )
    return decoded as RefreshTokenData
  } catch (err) {
    // console.log(err)
    return null
  }
}
