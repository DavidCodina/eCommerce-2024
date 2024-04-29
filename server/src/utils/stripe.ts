///////////////////////////////////////////////////////////////////////////
//
// Stripe Setup:
//
// 1. Go to https://dashboard.stripe.com/register & register for account.
//
// 2. After that I did not "Activate Account" or anything.
//    Instead go to https://dashboard.stripe.com/test/apikeys
//    From there you can immediately get your keys.
//
//    Publishable key : pk_test_...
//    Secret key : sk_test_...
//
// 3. Create Products in Stripe account. This can be done by navigating to
//    "Product catalog" AKA https://dashboard.stripe.com/test/products?active=true
//    From here click the "+ Add a product" button. I added "Sony Playstation 5" fro 499.99.
//    Now when you go to the details for that product you can see that there is an API ID
//    The ID is a reference to the associated product.
//
//      price_1OxF3i2KoYCkp3cr9BsdZhYy (Sony Playstation 5)
//      price_1OxF7i2KoYCkp3crcdzg721z (Samsung Galaxy)
//      price_1OxF942KoYCkp3crAvqhgr8T (Cannon EOS Camera)
//
// In practice it's easier to create products with Stripe using their API:
// https://docs.stripe.com/api/products/create
// This would likely entail having a set of endpoints that allow you (i.e., the site owner
// or the vendors) to upload products to your stripe 'store'.
// This topic is discussed briefly here at 37:30 : https://www.youtube.com/watch?v=p_q8gy_jmP8
//# At 40:30 he creates a seed.ts file that implements await stripe.products.create({ })
//
// 4. Go to https://dashboard.stripe.com/settings/account?support_details=true
//    Then fill out account details.
//
//     Account Name: DaveTek (This will be used as the title for the Stripe payment page)
//     Country: United States
//
// 5. For the server, we need to install stripe: npm i stripe.
// See the Stripe Node docs here: https://docs.stripe.com/api?lang=node
// See also info at:              https://www.npmjs.com/package/stripe
// Then create the POST '/api/checkout' route.
//
// This implementation sends back a URL that redirects the client to the Stripe payment screen.
//
//   https://checkout.stripe.com/c/pay/cs_test_...
//
// The Stripe test Visa card number is 4242 4242 4242 4242
// data 12/34 and 123 for the CVC
// Name on card can be anything. The rest can be anything.
//
// Once a payment goes through we can go to https://dashboard.stripe.com/test/payments
// to view the data.
//
///////////////////////////////////////////////////////////////////////////

import Stripe from 'stripe'
import * as dotenv from 'dotenv'
dotenv.config()

// Initialize the Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
