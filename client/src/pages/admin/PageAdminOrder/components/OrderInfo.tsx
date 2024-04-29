type OrderInfoProps = {
  order: Order | null
  status: 'idle' | 'pending' | 'success' | 'error'
}

/* ========================================================================
                                OrderInfo
======================================================================== */

export const OrderInfo = ({ order, status }: OrderInfoProps) => {
  /* ======================
      renderOrderInfo()
  ====================== */

  const renderOrderInfo = () => {
    // The 'error' status will be handled by the consuming component, so here just return null.
    if (status === 'error') {
      return null
    }

    if (status === 'pending') {
      return (
        <section className='mb-6 flex flex-wrap gap-8 rounded-xl border border-neutral-300 bg-white p-6'>
          <article className='h-[150px] basis-full animate-pulse rounded-lg bg-neutral-200 [animation-duration:1000ms] md:flex-1' />
          <article className='h-[150px] basis-full animate-pulse rounded-lg bg-neutral-200 [animation-duration:1000ms] md:flex-1' />
          <article className='h-[150px] basis-full animate-pulse rounded-lg bg-neutral-200 [animation-duration:1000ms] lg:flex-1' />
        </section>
      )
    }

    if (status === 'success' && order) {
      const { customer, shipping, isPaid, isDelivered, createdAt } = order

      const formattedCreatedAt = new Date(createdAt).toLocaleDateString(
        undefined,
        { year: 'numeric', month: 'long', day: 'numeric' }
      )

      return (
        <>
          <section className='mb-6 flex flex-wrap gap-8 rounded-xl border border-neutral-800 bg-white p-6'>
            <article className='basis-full md:flex-1'>
              <h3 className='border-b-2 border-blue-500 pb-1 text-center font-black text-blue-500'>
                Customer
              </h3>

              <ul>
                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>
                      First Name:
                    </span>
                    <span>{customer.firstName}</span>
                  </div>
                </li>

                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>Last Name:</span>
                    <span> {customer.lastName}</span>
                  </div>
                </li>

                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>Email:</span>
                    <span>{customer.email}</span>
                  </div>
                </li>

                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>Phone:</span>
                    <span> {customer.phone}</span>
                  </div>
                </li>
              </ul>
            </article>

            <article className='basis-full md:flex-1'>
              <h3 className='border-b-2 border-blue-500 pb-1 text-center font-black text-blue-500'>
                Shipping Address
              </h3>

              <ul>
                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>Address:</span>
                    <span>{shipping.address}</span>
                  </div>
                </li>

                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>City:</span>
                    <span>{shipping.city}</span>
                  </div>
                </li>

                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>State:</span>
                    <span>{shipping.state}</span>
                  </div>
                </li>

                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>
                      Postal Code:
                    </span>
                    <span>{shipping.postalCode}</span>
                  </div>
                </li>

                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>Country:</span>
                    <span>{shipping.country}</span>
                  </div>
                </li>
              </ul>
            </article>

            <article className='basis-full lg:flex-1'>
              <h3 className='border-b-2 border-blue-500 pb-1 text-center font-black text-blue-500'>
                Status
              </h3>

              <ul>
                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>
                      Created At:
                    </span>

                    <span>{formattedCreatedAt}</span>
                  </div>
                </li>

                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>Is Paid:</span>

                    <span>{isPaid === true ? '✅' : '❌'}</span>
                  </div>
                </li>

                <li>
                  <div className='flex flex-wrap justify-between'>
                    <span className='font-black text-blue-500'>
                      Is Delivered:
                    </span>

                    <span>{isDelivered === true ? '✅' : '❌'}</span>
                  </div>
                </li>
              </ul>
            </article>
          </section>
        </>
      )
    }

    return null
  }

  /* ======================
          return
  ====================== */

  return renderOrderInfo()
}
