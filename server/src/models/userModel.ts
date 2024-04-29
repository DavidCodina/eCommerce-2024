import { Schema, model } from 'mongoose'
import { shippingSchema } from './shippingSchema'

const userSchema = new Schema<User>(
  {
    userName: {
      type: String,
      required: true
    },

    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      // unique  doesn't catch case insensitivity, so david@example.com
      // and David@example.com are considered different by mongoose.
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: false
    },

    shipping: {
      type: shippingSchema,
      required: false
    },
    roles: {
      type: [String],
      default: ['user'],
      required: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    timestamps: true
  }
)

const User = model('User', userSchema)

export default User
