import mongoose from 'mongoose'

///////////////////////////////////////////////////////////////////////////
//
// https://bobbyhadz.com/blog/typescript-make-types-global
// Note also that typescript-eslint recommends NOT using no-undef.
// https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
//
// The declare keyword in TypeScript is used to tell the compiler that the variable, class,
// function, or module is already defined elsewhere. When we use declare namespace Express,
// we're not overwriting the existing Express types, but rather adding to them.
//
///////////////////////////////////////////////////////////////////////////

declare global {
  interface OrderItem {
    name: string
    quantity: number
    price: number
    product: Product | mongoose.Types.ObjectId
  }

  interface OrderCustomer {
    firstName: string
    lastName: string
    email: string
    phone: string
  }

  interface Order {
    _id: mongoose.Types.ObjectId
    orderItems: OrderItem[]
    user?: User | mongoose.Types.ObjectId
    customer: OrderCustomer
    shipping: Shipping
    subtotal: number
    shippingCost: number
    tax: number
    total: number
    isPaid: boolean
    paidAt?: string
    isDelivered: boolean
    deliveredAt?: string
    stripeSessionId?: string
    createdAt: string
    updatedAt: string
  }

  interface ProductCreator {
    firstName: string
    lastName: string
    user: User | mongoose.Types.ObjectId
  }

  interface ProductReview {
    userName: string
    rating: number
    comment: string
    user: User | mongoose.Types.ObjectId
  }

  interface Product {
    _id: mongoose.Types.ObjectId
    creator: ProductCreator
    name: string
    description: string
    image: string
    category: string
    brand: string
    price: number
    rating: number
    reviews: ProductReview[]
    reviewCount: number
    stock: number
    isActive: boolean
    stripeProductId?: string
    stripePriceId?: string
    createdAt: string
    updatedAt: string
  }

  type Roles = 'user' | 'manager' | 'admin'

  type Shipping = {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }

  type User = {
    _id: mongoose.Types.ObjectId
    userName: string
    firstName: string
    lastName: string
    email: string
    // intentionally omitted password
    password: string
    phone?: string
    shipping?: Shipping
    roles: Roles[]
    isActive: boolean
    createdAt: string
    updatedAt: string
  }

  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export {}
