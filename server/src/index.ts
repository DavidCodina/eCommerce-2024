// Third-party imports
import path from 'path'
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express /*, { Request, Response , NextFunction } */ from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'

////////////////////////////////////////////////////////////////////////////////
//
// When working with bundlers like ESBuild, command line errors often point toward the
// bundled index.js file. This happens because the bundler transforms your code and combines
// it into a single file, and the error is thrown in the context of the transformed code,
// not the original source code. This can be challenging when one is debugging.
//
// Another solution if you get an error is to simply run:  "test:build": "tsc -noEmit",
// Thus in nodemon.json I changed this:
//
//   "exec": "npm run build && node ./dist/index.js",
//
// To:
//
//   "exec": "npm run test:build && npm run build && node ./dist/index.js",
//
// But actually, there's a better solution (make sure sourcemap:true in esbuild config):
//
//   import 'source-map-support/register'
//
////////////////////////////////////////////////////////////////////////////////
import 'source-map-support/register'

import { errorHandler, notFound } from 'middleware/errorMiddleware'
import { connectDB } from 'config/db'
import indexRoute from './routes'
import productRoutes from './routes/productRoutes'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import orderRoutes from './routes/orderRoutes'
import adminOrderRoutes from './routes/admin/orderRoutes'
import adminProductRoutes from './routes/admin/productRoutes'
import adminUserRoutes from './routes/admin/userRoutes'
import adminUploadRoutes from './routes/admin/uploadRoutes'

dotenv.config()
connectDB()
const app = express()

/* ======================
    Global Middleware
====================== */

app.use(morgan('dev'))

// No need to add 'http://localhost:3000' since it's covered
// by  process.env.NODE_ENV === 'development' check.
// Otherwise, add allowed domains here...
const allowOrigins: string[] = [
  // 'http://localhost:3000'
  // '...'
]

const corsOptions = {
  origin: (origin: any, callback: any) => {
    // This should allow all origins during development.
    // This way, we can test Postman calls.
    // An alternative syntax would be: if (!origin) { callback(null, true) }
    if (process.env.NODE_ENV === 'development') {
      // The first arg is the error object.
      // The second arg is the allowed boolean.
      callback(null, true)
      // This else if is saying if the origin URL is in the
      // list of allowedOrigins, then allow it (i.e. callback(null, true))
      // Note: that will also end up disallowing Postman
    } else if (allowOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, // This sets the Access-Control-Allow-Credentials header
  // methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  // The default may be 204, but some devices have issues with that
  // (Smart TVs, older browsers, etc), so you might want to set it to 200 instead.
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions)) // You should be able to just do app.use(cors()) when a public API

// Setting the limit property can help avoid '413 Payload Too Large' errors.
// I think by default it's 100kb.
app.use(express.json({ limit: '50mb' })) // ???
app.use(express.urlencoded({ extended: true })) // For handling FormData
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public'))) // For serving static files (CSS, etc.)

/* ======================
        Routes
====================== */
// Note that whenever possible the routes reflect the
// name of the collections (i.e., they are plural)

app.use('/api', indexRoute)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.use('/api/admin/orders', adminOrderRoutes)
app.use('/api/admin/products', adminProductRoutes)
app.use('/api/admin/users', adminUserRoutes)
app.use('/api/admin/upload', adminUploadRoutes)

///////////////////////////////////////////////////////////////////////////
//
// To create a product with stripe we can
//  await stripe.products.create({
//    name: <string>,
//    defuault_price_data: { currency: ..., unit_amount_decimal: <number>},
//    images: <array> (optional)
// })
//
// In practice, we would have an endpoint for admins to add products.
// In that endpoint, we would use this endpoint to create a product
// in Stripe, and also in our database.
//
// Fun fact: you can get your products like this:
// https://docs.stripe.com/api/prices/list?lang=node
// However, we don't actually want to get products direclty from
// stripe. We should have products, orders and possibly customers tables
// in our database. Many basic tutorials use Stripe kind of like a database.
// However, that's not really a good practice for production-grade applications.
// See here at 52:30 : https://www.youtube.com/watch?v=p_q8gy_jmP8
//
// app.get('/api/prices', async (req, res) => {
//   try {
//     const data = await stripe.prices.list({
//       expand: ['data.product'] // or [data.default_price]
//     })

//     return res.status(200).json({
//       data: data,
//       message: 'Success.',
//       success: true
//     })
//   } catch (err) {
//     res.status(500).json({
//       data: null,
//       message: 'Request failed.',
//       success: false
//     })
//   }
// })
//
///////////////////////////////////////////////////////////////////////////

app.use(notFound)
app.use(errorHandler)

/* ======================

====================== */

const port = process.env.PORT || 5000

mongoose.connection.once('open', () => {
  console.log('Calling app.listen() now that the database is connected.')
  app.listen(port, () => console.log(`Server listening on port ${port}!`))
})
