import { Schema, model } from 'mongoose'
import { shippingSchema } from './shippingSchema'

// Creating a subschema allows us to set _id: false, so
// We don't get a random _id attached.
const orderItemSchema = new Schema<OrderItem>(
  {
    // Even though name, quantity and price are on the product itself,
    // They are added here as a historical record of the product as it
    // was at the time that this order was created and then paid for.
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    }
  },
  { _id: false }
)

const orderSchema = new Schema<Order>(
  {
    orderItems: {
      type: [orderItemSchema],
      required: true
    },

    // In the createOrder controller we will check if there is a user.
    // If there is a user then add them to the order.
    user: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User'
    },

    //! Change the shape of this to add user INSIDE of customer.
    //! Then remove user above.
    //! Make customer a subschema.
    // In Brad's model, there is always a user associated to an order.
    // However, we may not have an actual signed in user.
    // Instead, we can add customer data.
    customer: {
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
        required: true
      },
      phone: {
        type: String,
        required: true
      }
    },

    shipping: shippingSchema,

    subtotal: {
      type: Number,
      required: true,
      default: 0.0
    },

    shippingCost: {
      type: Number,
      required: true,
      default: 0.0
    },

    tax: {
      type: Number,
      required: true,
      default: 0.0
    },

    total: {
      type: Number,
      required: true,
      default: 0.0
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },

    paidAt: {
      type: Date,
      required: false
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false
    },

    deliveredAt: {
      type: Date,
      required: false
    },

    // We could instead add stripeSession: { ... }
    stripeSessionId: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)

const Order = model('Order', orderSchema)

export default Order
