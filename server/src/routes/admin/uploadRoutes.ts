import path from 'path'
import express, { Request, Response /*, NextFunction */ } from 'express'

import multer from 'multer'

const router = express.Router()

const upload = multer({
  // A `StorageEngine` responsible for processing files uploaded via Multer.
  // Takes precedence over `dest`.
  storage: multer.diskStorage({
    ///////////////////////////////////////////////////////////////////////////
    //
    // By NOT using 'src/public/images' we can avoid potential conflicts with
    // the front end's public/images folder.
    //
    // In order to access the images on the Vite client do this:
    //
    //   proxy: {
    //     '/static': {
    //       target: 'http://localhost:5000',
    //       changeOrigin: true,
    //       secure: false,
    //       rewrite: (path) => { return path }
    //     }
    //   }
    //
    // Ultimately, none of this would be necessary if we were using S3 or Cloudinary,
    // but since we're just using the server for this demo we need to do some stuff that we normally woundn't.
    //
    ///////////////////////////////////////////////////////////////////////////

    destination(_req, _file, cb) {
      cb(null, 'src/public/static/images')
    },
    filename(_req, file, cb) {
      cb(
        null,
        // Brad does this: ${file.fieldname}-${Date.now()}${path.extname(file.originalname)}
        `${file.originalname}`
      )
    }
  }),

  // A function to control which files should be uploaded and which should be skipped
  // pass a boolean to indicate if the file should be accepted
  // pass an error if something goes wrong
  fileFilter: (req, file, cb) => {
    const filetypes = /jpe?g|png|webp/
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/

    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    )
    const mimetype = mimetypes.test(file.mimetype)

    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Only .jpg/.jpeg & .png images are accepted.'))
    }
  }
})

const uploadSingleImage = upload.single('image')

/* =============================================================================

============================================================================= */
////////////////////////////////////////////////////////////////////////////////
//
// This endpoint has a single responsibility: receive image files as FormData
// and send back the URL. Consequently, it can be used for any image uploads.
//
// Why is this it's own route, and not baked into the createProduct and updateProduct
// controllers? This logic definitely could be baked into those controllers. However,
// then the associated client API calls would have to send FormData instead of JSON.
//
// The flow for the client app when creating a product would be to have a form that gathers
// all data, then make the API call to upload the image, then make the API call to upload
// the product data, including the 'image' url returned from the first API request.
//
// Alternatively, we can entirely omit the image upload API call when creating a product.
// Then we can upload a new image from PageAdminProduct, replacing the sample image.
// This flow is often preferable because it ensures that the product is created BEFORE
// uploading an image. Thus we don't have to worry about orphaned images.
//
// Ultimately, we wouldn't uploading images directly to the server, but this is a quick
// and dirty solution for the demo, rather than using S3 or Cloudinary.
//
////////////////////////////////////////////////////////////////////////////////

router.post('/', (req: Request, res: Response) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(400).send({
        data: null,
        message: err.message,
        success: false
      })
    }

    res.status(200).send({
      // ESBuild moves everything from 'src/public' to 'dist/public'
      // Consequently, we do NOT want to use the req.file.path provided by multer.
      data: `/static/images/${req.file?.filename}`,
      message: 'Success.',
      success: true
    })
  })
})

export default router
