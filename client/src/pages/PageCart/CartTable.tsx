import { Fragment, CSSProperties } from 'react'
import { useCartContext } from 'contexts'
import { SimpleTable } from 'components/SimpleTable'
import { formatCurrency } from 'utils'

type CartTableProps = {
  cartProducts: Product[] | null
}

type Row = {
  id: string
  name: string
  quantity: number
  price: number
  itemTotal: number
}

const cols = [
  { key: 'product', label: 'Product' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'price', label: 'Price' },
  { key: 'total', label: 'Total' }
]

const colStyles: CSSProperties[] = [
  { minWidth: 100, paddingLeft: 8, paddingRight: 8, textAlign: 'center' },
  {
    width: 120,
    textAlign: 'center',
    paddingLeft: 8,
    paddingRight: 8
  },
  { textAlign: 'center', minWidth: 100, paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', minWidth: 100, paddingLeft: 8, paddingRight: 8 }
]

/* ========================================================================
                                CartTable
======================================================================== */
// Could spruce up the table by adding an image for each item, but I will omit that for now.

export const CartTable = ({ cartProducts }: CartTableProps) => {
  const { cartItems, addOneToCart, removeOneFromCart } = useCartContext()

  /* ======================
        state & refs
  ====================== */

  const subtotal = (() => {
    let total = cartItems.reduce((acc, item) => {
      //# We need more robust error checking here and on the API call to getCartProducts().
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

      // Anytime cartItems change from this page and/or checkout page, there could be an
      // API call to the server to get shipping, tax, and total.
      return {
        id: item.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        itemTotal: itemTotal
      }
    })
    .filter((row) => {
      return typeof row !== 'undefined'
    }) as Row[]

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
                <tr
                  key={id}
                  className='group/tr -outline-offset-1 hover:outline hover:outline-blue-800'
                >
                  <td
                    className='group-hover/tr:border-blue-800'
                    style={{ paddingLeft: 8, paddingRight: 8 }}
                  >
                    {name}
                  </td>
                  <td
                    className='group-hover/tr:!border-blue-800'
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      textAlign: 'center'
                    }}
                  >
                    {/* An alternative approach would entail having a function that added 
                    n number of items to cart, and used an input type="number" */}
                    <div className='flex items-center justify-center'>
                      <button
                        className='px-2'
                        onClick={() => removeOneFromCart(id)}
                      >
                        -
                      </button>
                      <span className='min-w-6 font-bold'>{quantity}</span>
                      <button
                        className='px-2'
                        onClick={() => {
                          const product = cartProducts?.find(
                            (p) => p._id === id
                          )

                          if (product) {
                            addOneToCart(product)
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td
                    className='group-hover/tr:!border-blue-800'
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      textAlign: 'center'
                    }}
                  >
                    {formatCurrency(price)}
                  </td>

                  <td
                    className='group-hover/tr:!border-blue-800'
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      textAlign: 'right'
                    }}
                  >
                    {formatCurrency(itemTotal)}
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
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </th>
          </tr>
        </tfoot>
      </Fragment>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <SimpleTable
      // size='sm'
      bordered
      striped
      // stripedData
      hover
      rounded={5}
      useContainer
      className={`
        group bg-white
        [--table-hover-bg:theme(colors.blue.400)]
        [--table-hover-color:#fff]
        [--table-striped-bg:theme(colors.neutral.100)]
        `}
      containerClassName='mx-auto mb-4 border border-neutral-400 text-nowrap'
      // containerStyle={{}}
      // captionTop
    >
      {renderData()}
    </SimpleTable>
  )
}
