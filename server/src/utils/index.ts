import { Response } from 'express'

/* ======================
        sleep()
====================== */
// Used in API calls to test/simulate a slow call
// Example: await sleep(4000)

export const sleep = async (delay = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, delay)) // eslint-disable-line
}

/* ======================
      getZodErrors()
====================== */

export const getZodErrors = (issues: Record<string, any>[] = []) => {
  const errors: Record<string, string> = {}

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i]
    errors[issue?.path?.[0]] = issue?.message
  }
  return errors
}

/*
///////////////////////////////////////////////////////////////////////////
//
// Get concise Zod errors from the result of <Somechema>.safeParse(data)
//
// Usage:
//
//   const DataSchema = z.object({
//     id: z.string().nonempty(),
//     name: z.string().nonempty(),
//     email: z.string().email()
//   })
//
//   type DataType = z.infer<typeof DataSchema>
//
//   const data: DataType = {
//     id: 123,
//     name: '',
//     email: 'david@example.com'
//   }
//
//   const result = DataSchema.safeParse(data)
//
//   if (!result.success) {
//     // console.log('\n\nError issues:', result?.error?.issues)
//     const errors = getZodErrors(result?.error?.issues)
//     console.log(errors)
//   }
//
// Logs:
//
//   [
//     { name: 'id',   message: 'Expected string, received number' },
//     { name: 'name', message: 'String must contain at least 1 character(s)' }
//   ]
//
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
//
// The name property naively assumes that there is a 1:1 relationship
// between a key and the invalid value. For example, a client-side input
// generally only has one value, so sending an error back for that
// issue.path[0] makes sense.
//
// However, things get more complex when an object has nested objects within it,
// which is actually quite common:
//
//   const DataSchema = z.object({
//     user: z.object({ name: z.string().nonempty(), age: z.number().int().gt(0)
//     })
//   })
//
//   type DataType = z.infer<typeof DataSchema>
//
//   const data: DataType = {
//     user: { name: 'David', age: -1 }
//   }
//
//   const result = DataSchema.safeParse(data)
//   console.log(result)
//
//   if (!result.success) {
//     console.log('\n\nError issues:', result.error.issues)
//     const errors = getZodErrors(result?.error?.issues)
//     console.log(errors)
//   }
//
// In this case, issue/error would occur at path: [ 'user', 'age' ]
// This could actually be very important information for the client,
// when it comes to user UI message, debugging, etc.
// Thus, the 'name' property is convenient, but potentially oversimplified.
// On the other hand, the path array is precise, but not necessarily the most convenient.
// For this reason, it may be useful to send both back. This was a previous version:
//
// export const getZodErrors = (issues: Record<string, any>[] = []) => {
//   const errors: { name: string; message: string; path: string[] }[] = []
//   for (let i = 0; i < issues.length; i++) {
//     const issue = issues[i]
//     // Could use continue keyword if not name or message.
//     errors.push({
//       name: issue?.path?.[0],
//       message: issue?.message,
//       path: issue?.path
//     })
//   }
//   return errors
// }
//
///////////////////////////////////////////////////////////////////////////



/* ======================
  handleServerError()
====================== */
// Log error to Sentry...

export const handleServerError = (res: Response, err: unknown) => {
  const isDevelopment = process.env.NODE_ENV === 'development' ? true : false
  let message = 'Server error.'

  if (isDevelopment) {
    if (err instanceof Error) {
      message = err.message
      console.log({ name: err.name, message: message, stack: err.stack })
    } else {
      console.log(err)
    }
  }

  return res.status(500).json({
    data: null,
    message: message,
    success: false
  })
}
