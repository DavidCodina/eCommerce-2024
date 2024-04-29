import { Fragment, CSSProperties } from 'react'
import { SimpleTable } from 'components/SimpleTable'
import { formatCurrency } from 'utils'

const cols = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'price', label: 'Price' },
  { key: 'total', label: 'Total' }
]

const colStyles: CSSProperties[] = [
  { textAlign: 'center', minWidth: 100, paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', minWidth: 100, paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', minWidth: 100, paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', minWidth: 100, paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', minWidth: 100, paddingLeft: 8, paddingRight: 8 }
]

type Row = {
  id: string
  name: string
  quantity: number
  price: number
  itemTotal: number
}

type OrderTableProps = {
  order: Order | null
  status: 'idle' | 'pending' | 'success' | 'error'
}

/* ========================================================================

======================================================================== */

export const OrderTable = ({ order, status }: OrderTableProps) => {
  /* ======================
        renderData()
  ====================== */

  const renderData = () => {
    if (!order) {
      return null
    }

    const rows = order.orderItems
      .map((item) => {
        let itemTotal = item.quantity * item.price
        itemTotal = Math.round(itemTotal * 100) / 100

        return {
          id: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          itemTotal: itemTotal
        }
      })
      .filter((row) => {
        return typeof row !== 'undefined'
      }) as Row[]

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
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      textAlign: 'center'
                    }}
                  >
                    {id}
                  </td>

                  <td
                    className='group-hover/tr:border-blue-800'
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      textAlign: 'center'
                    }}
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
                    n number of items to cart, and used an input type="number"  */}
                    <div className='flex items-center justify-center'>
                      {quantity}
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
                      textAlign: 'center'
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
          <tr>
            <th colSpan={4}>Subtotal:</th>

            <td
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                textAlign: 'center'
              }}
            >
              {formatCurrency(order.subtotal)}
            </td>
          </tr>

          <tr>
            <th colSpan={4}>Shipping:</th>

            <td
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                textAlign: 'center'
              }}
            >
              {formatCurrency(order.shippingCost)}
            </td>
          </tr>

          <tr>
            <th colSpan={4}>Tax:</th>

            <td
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                textAlign: 'center'
              }}
            >
              {formatCurrency(order.tax)}
            </td>
          </tr>

          <tr>
            <th colSpan={4}>Total:</th>

            <td
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                textAlign: 'center'
              }}
            >
              {formatCurrency(order.total)}
            </td>
          </tr>
        </tfoot>
      </Fragment>
    )
  }

  /* ======================
      renderTable
  ====================== */

  const renderTable = () => {
    // The 'error' status will be handled by the consuming component, so here just return null.
    if (status === 'error') {
      return null
    }

    if (status === 'pending') {
      return (
        <section className='mb-6 animate-pulse rounded-lg border border-neutral-400 bg-white [animation-duration:1000ms]'>
          <div className='flex h-[40px] border-b border-neutral-400 bg-neutral-200'>
            <div className='flex-1 border-r border-neutral-400' />
            <div className='flex-1 border-r border-neutral-400' />
            <div className='flex-1 border-r border-neutral-400' />
            <div className='flex-1 border-r border-neutral-400' />
            <div className='flex-1' />
          </div>

          <div className='h-[40px] border-b border-neutral-400 bg-white' />
          <div className='h-[40px] border-b border-neutral-400 bg-neutral-100 ' />

          <div className='h-[40px] border-b border-neutral-400 bg-white' />
          <div className='h-[40px] border-b border-neutral-400 bg-neutral-100' />

          <div className='h-[40px] border-b border-neutral-400 bg-white' />
          <div className='h-[40px] bg-neutral-100' />
        </section>
      )
    }

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

  /* ======================
          return
  ====================== */

  return renderTable()
}
