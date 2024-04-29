import { Fragment, CSSProperties, useEffect, useState, useRef } from 'react'
import { useCartContext } from 'contexts'
import { SimpleTable } from 'components/SimpleTable'

const cols = [
  { key: 'product', label: 'Product' },
  { key: 'quantity', label: 'Quantity' },

  { key: 'price', label: 'Price' },
  { key: 'total', label: 'Total' }
]
const colStyles: CSSProperties[] = [
  { minWidth: 100, paddingLeft: 8, paddingRight: 8 },
  {
    width: 120,
    textAlign: 'center',
    paddingLeft: 8,
    paddingRight: 8
  },
  { textAlign: 'center', minWidth: 100, paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'right', minWidth: 100, paddingLeft: 8, paddingRight: 8 }
]

const caretLeft = (
  <svg
    width='1em'
    height='1em'
    // className='fill-blue-500'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path d='m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z' />
  </svg>
)
const caretRight = (
  <svg
    width='1em'
    height='1em'
    // className='fill-blue-500'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path d='m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z' />
  </svg>
)

type Row = {
  id: string
  name: string
  quantity: number
  price: number
  itemTotal: string
}

/* ========================================================================

======================================================================== */
// Could spruce up the table by adding an image for each item, but I will omit that for now.

export const CartTable = () => {
  const firstRenderRef = useRef(true)

  const { cartItems, addOneToCart, removeOneFromCart, getCartProducts } =
    useCartContext()

  const [cartProducts, setCartProducts] = useState<Product[] | null>(null)

  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  const subtotal = (() => {
    let total = cartItems.reduce((acc, item) => {
      //# We need some more robust error checking here and on the API call to getCartProducts().
      const price = cartProducts?.find((p) => p._id === item.id)
        ?.price as number
      return acc + item.quantity * price
    }, 0)

    // Gotcha: floating-point numbers are stored in binary format, which can lead
    // to small inaccuracies when performing arithmetic operations. To make sure
    // you don't end up getting an extended decimal value do this:
    total = Math.round(total * 100) / 100

    return total
  })()

  /* ======================
            rows
  ====================== */

  const rows = cartItems
    .map((item) => {
      const product = cartProducts?.find((p) => p._id === item.id) as Product

      // Make sure there is a product! Why because row data depends on it.
      if (!product) {
        return
      }

      // Gotcha: floating-point numbers are stored in binary format, which can lead
      // to small inaccuracies when performing arithmetic operations. To make sure
      // you don't end up getting an extended decimal value do this:
      let itemTotal = item.quantity * product.price
      itemTotal = Math.round(itemTotal * 100) / 100

      return {
        id: item.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        itemTotal: `$${itemTotal.toLocaleString()}`
      }
    })
    .filter((row) => {
      return typeof row !== 'undefined'
    }) as Row[]

  /* ======================
        useEffect()
  ====================== */
  // On mount only, get the full product data for each item in cartItems.

  useEffect(() => {
    if (firstRenderRef.current === false) {
      return
    }
    firstRenderRef.current = false

    setStatus('pending')
    const productIds = cartItems.map((item) => item.id)
    getCartProducts(productIds)
      .then((result) => {
        const { success, data } = result

        if (success === true && Array.isArray(data)) {
          setCartProducts(data)
          setStatus('success')
        } else {
          setStatus('error')
        }
        return result
      })

      //# Do something...
      .catch((_err) => {
        setStatus('error')
      })
  }, [cartItems, getCartProducts])

  /* ======================
          return
  ====================== */

  const renderData = () => {
    return (
      <Fragment>
        <thead className='bg-neutral-200 align-middle uppercase'>
          <tr role='row'>
            {cols.map((col, index) => {
              return (
                <th key={col.key} style={colStyles[index]}>
                  {col.label}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody
          className='align-middle' // 'text-center table-group-divider'
        >
          {!Array.isArray(rows) || rows.length === 0 ? (
            <tr role='row'>
              <td
                className='pointer-events-none h-40 text-center align-middle font-medium'
                colSpan={cols.length}
                role='gridcell'
              >
                No rows to display!
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const { id, name, price, quantity, itemTotal } = row
              return (
                <tr key={id}>
                  <td style={{ paddingLeft: 8, paddingRight: 8 }}>{name}</td>
                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      textAlign: 'center'
                    }}
                  >
                    {/* An alternative approach would entail having a function that added 
                    n number of items to cart, and used an input type="number"  */}
                    <div className='flex items-center justify-center'>
                      <button
                        className='px-1'
                        onClick={() => removeOneFromCart(id)}
                      >
                        {caretLeft}
                      </button>
                      <span className='min-w-[32px]'>{quantity}</span>
                      <button
                        className='px-1'
                        onClick={() => {
                          const product = cartProducts?.find(
                            (p) => p._id === id
                          )

                          if (product) {
                            addOneToCart(product)
                          }
                        }}
                      >
                        {caretRight}
                      </button>
                    </div>
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      textAlign: 'center'
                    }}

                    //# See WDS at 24:30 for a basic currency formatter function.
                    //# https://www.youtube.com/watch?v=lATafp15HWA
                    //# See also Dave Gray at 38:00 : https://www.youtube.com/watch?v=6Qqb2GBGgGc
                    //# For additional inspiration, see use-shopping-cart package's formatCurrencyString():
                    //# https://github.com/dayhaysoos/use-shopping-cart/blob/master/use-shopping-cart/core/Entry.js
                  >
                    ${price.toLocaleString()}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      textAlign: 'right'
                    }}
                  >
                    {itemTotal}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>

        <tfoot>
          {/* In the actual checkout process we would eventually need to calculate shipping and tax. */}
          <tr>
            <th colSpan={4}>
              <div className='flex items-center justify-between px-2'>
                <span className='text-base text-blue-500'>Subtotal:</span>

                <span className='text-base text-green-500'>
                  ${subtotal.toLocaleString()}
                </span>
              </div>
            </th>
          </tr>
        </tfoot>
      </Fragment>
    )
  }

  /* ======================
      renderTable
  ====================== */

  const renderTable = () => {
    //# If error...

    //# Improve UI here...
    //# Also we don't want to set pending every single time there is a change in cartItems quantity.
    if (status === 'pending') {
      return (
        <div className='mb-6 p-6 text-center text-2xl font-black text-blue-500'>
          Loading...
        </div>
      )
    }

    return (
      <SimpleTable
        size='sm'
        bordered
        striped
        // stripedData
        hover
        rounded={5}
        useContainer
        className={`group bg-white [--table-hover-bg:theme(colors.blue.400)] [--table-hover-color:#fff] [--table-striped-bg:theme(colors.neutral.100)]`}
        containerClassName='mx-auto mb-6 border border-neutral-400'
        // containerStyle={{}}
        // captionTop
      >
        {renderData()}
      </SimpleTable>
    )
  }

  /* ======================
          return
  ====================== */

  return renderTable()
}
