// https://bobbyhadz.com/blog/typescript-make-types-global
//
// Note: Matt Pocock is against using global.d.ts in this way:
// https://www.youtube.com/watch?v=zu-EgnbmcLY

declare global {
  type Test = 'Testing 123...'

  interface Shades {
    '50': string
    '100': string
    '200': string
    '300': string
    '400': string
    '500': string
    '600': string
    '700': string
    '800': string
    '900': string
    '950': string
  }

  interface Colors {
    inherit: 'inherit'
    current: 'currentColor'
    transparent: 'transparent'
    black: '#000'
    white: '#fff'
    slate: Shades
    gray: Shades
    zinc: Shades
    neutral: Shades
    stone: Shades
    red: Shades
    orange: Shades
    amber: Shades
    yellow: Shades
    lime: Shades
    green: Shades
    emerald: Shades
    teal: Shades
    cyan: Shades
    sky: Shades
    blue: Shades
    indigo: Shades
    violet: Shades
    purple: Shades
    fuchsia: Shades
    pink: Shades
    rose: Shades
    olive: Shades // Custom
    brown: Shades // Custom
    light: string // Custom
    dark: string // Custom
  }

  type Color = keyof Colors
  type Shade = keyof Shades

  // ColorDictionary is a mapped type derived from the global Colors interface.
  // Colors is hardcoded, but ensures us some type safety as the single source of truth.
  type ColorDictionary = {
    [K in keyof Colors]: string
  }

  type Roles = 'user' | 'manager' | 'admin'

  type Shipping = {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }

  // Typing everything out like this is tedious, but it in addition
  // to type hinting, it also points out typos.
  type User = {
    _id: string
    userName: string
    firstName: string
    lastName: string
    email: string
    // intentionally omitted password
    phone: string
    /** The will only have shipping information if they've completed the update user
     * form in the profile page.
     */
    shipping?: Shipping
    roles: Roles[]
    isActive: boolean
    createdAt: string
    updatedAt: string
  }

  type API_Response<T = unknown> = Promise<{
    data: T
    message: string
    success: boolean
    errors?: Record<string, string> | null
  }>

  type Review = {
    userName: string
    rating: number
    comment: string
    user: User | string
  }

  type Product = {
    _id: string
    creator: { name: string; user: User | string } // i.e., actual user or ObjectId reference
    name: string
    description: string
    image: string
    category: string
    brand: string
    price: number
    rating: number
    reviews: Review[]
    reviewCount: number
    review
    reviews
    stock: number
    isActive: boolean
    stripeProductId?: string
    stripePriceId?: string
    createdAt: string
    updatedAt: string
  }

  type CartItem = {
    quantity: number
    id: string
  }

  type OrderItem = {
    name: string
    quantity: number
    price: number
    product: any // string or Product
  }

  type Customer = {
    firstName: string
    lastName: string
    email: string
    phone: string
  }

  // Typing everything out like this is tedious, but it in addition
  // to type hinting, it also points out typos.
  type Order = {
    _id: string
    orderItems: OrderItem[]
    customer: Customer
    user?: any //# user needs a type
    shipping: Shipping
    subtotal: number
    shippingCost: number
    tax: number
    total: number
    isPaid: boolean
    isDelivered: boolean
    paidAt?: string
    deliveredAt?: string
    stripeSessionId?: string
    createdAt: string
    updatedAt: string
  }
}

export {}
