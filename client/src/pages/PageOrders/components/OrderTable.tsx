import { Fragment, CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'components'
import { SimpleTable } from 'components/SimpleTable'
import { formatCurrency } from 'utils'

type OrderTableProps = {
  orders: Order[]
}

const cols = [
  { key: '_id', label: 'ID' },

  // This part seems redundant, but we can leave it in.
  { key: 'customer', label: 'Customer' },
  { key: 'createdAt', label: 'Created' },
  { key: 'total', label: 'Total' },
  { key: 'paymentStatus', label: 'Paid' },
  { key: 'paidAt', label: 'Paid At' },
  { key: 'deliveryStatus', label: 'Delivered' },
  { key: 'deliveredAt', label: 'Delivered At' },
  { key: 'details', label: 'Details' }
]

const colStyles: CSSProperties[] = [
  { textAlign: 'center', paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', paddingLeft: 8, paddingRight: 8 },
  { textAlign: 'center', paddingLeft: 8, paddingRight: 8 }
]

/* ========================================================================

======================================================================== */
//# Table works for now, but is not styled that great.

export const OrderTable = ({ orders }: OrderTableProps) => {
  const navigate = useNavigate()

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
        <tbody className='align-middle'>
          {!Array.isArray(orders) || orders.length === 0 ? (
            <tr role='row'>
              <td
                className='pointer-events-none h-40 text-center align-middle font-medium'
                colSpan={cols.length}
                role='gridcell'
              >
                No orders to display!
              </td>
            </tr>
          ) : (
            orders.map((order: Order) => {
              const {
                _id,
                customer,
                createdAt,
                total,
                isPaid,
                paidAt, // Possibly undefined
                isDelivered,
                deliveredAt // Possibly undefined
              } = order

              const formattedCreatedAt = new Date(createdAt).toLocaleDateString(
                undefined,
                { year: 'numeric', month: 'long', day: 'numeric' }
              )

              const formattedPaidAt =
                paidAt && typeof paidAt === 'string'
                  ? new Date(paidAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : null

              const formattedDeliveredAt =
                deliveredAt && typeof deliveredAt === 'string'
                  ? new Date(deliveredAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : null

              return (
                <tr key={_id} className='text-center'>
                  <td style={{ paddingLeft: 8, paddingRight: 8 }}>{_id}</td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {customer?.firstName} {customer?.lastName}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {formattedCreatedAt}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {formatCurrency(total)}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {isPaid === true ? '✅' : '❌'}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {formattedPaidAt || '-'}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {isDelivered === true ? '✅' : '❌'}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {formattedDeliveredAt || '-'}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    <Button
                      className='btn-blue btn-xs'
                      onClick={() => {
                        navigate(`/orders/${_id}`)
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
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
      // hover
      rounded={5}
      useContainer
      className={`bg-white`}
      containerClassName='mx-auto mb-4 border border-neutral-400 text-nowrap'
      // containerStyle={{}}
      // captionTop
    >
      {renderData()}
    </SimpleTable>
  )
}
