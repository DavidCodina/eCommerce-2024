import { Schema, model } from 'mongoose'

const reviewSchema = new Schema<ProductReview>(
  {
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    //# { _id: false }
    timestamps: true
  }
)

const creatorSchema = new Schema<ProductCreator>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  { _id: false }
)

const productSchema = new Schema<Product>(
  {
    ///////////////////////////////////////////////////////////////////////////
    //
    // In the Traversy Media eCommerce tutorial video 4.4 at 4:15 the user was defined directly
    // on the productSchema. However, if for some reason an admin user is deleted,
    // we end up with a dead reference. Instead, it's better to add a creator
    // property that has a "historical record" of the user in addition to
    // the user reference.
    //
    ///////////////////////////////////////////////////////////////////////////
    creator: {
      type: creatorSchema,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    brand: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      default: 0
    },

    rating: {
      type: Number,
      required: true,
      default: 0
    },

    reviews: {
      type: [reviewSchema],
      required: false,
      default: []
    },

    reviewCount: {
      type: Number,
      required: true,
      default: 0
    },

    stock: {
      type: Number,
      required: true,
      default: 0
    },

    isActive: {
      type: Boolean,
      required: true,
      // When a product is created, the admin is redirected to
      // the associated PageAdminProduct. From there they can
      // activate the product.
      default: false
    },

    stripeProductId: {
      type: String,
      required: true
    },

    stripePriceId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Product = model('Product', productSchema)

export default Product
