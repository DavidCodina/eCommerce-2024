import { Fragment, CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'components'
import { SimpleTable } from 'components/SimpleTable'
import { DeleteProductButton } from './DeleteProductButton'
import { formatCurrency } from 'utils'

type ProductsTableProps = {
  products: Product[]
  onProductDeleted: () => void
}

const cols = [
  { key: '_id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'category', label: 'Category' },
  { key: 'brand', label: 'Brand' },
  { key: 'isActive', label: 'Is Active' },
  { key: 'actions', label: '' }
]

const colStyles: CSSProperties[] = [
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
//# Ultimately, this table needs to be paginated.

export const ProductTable = ({
  products,
  onProductDeleted
}: ProductsTableProps) => {
  const navigate = useNavigate()

  /* ======================
       renderData()
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
          {!Array.isArray(products) || products.length === 0 ? (
            <tr role='row'>
              <td
                className='pointer-events-none h-40 text-center align-middle font-medium'
                colSpan={cols.length}
                role='gridcell'
              >
                No products to display!
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const {
                _id,
                name,
                price,
                category,
                brand,
                isActive
                // stock,
                // rating
              } = product

              return (
                <tr key={_id} className='text-center'>
                  <td style={{ paddingLeft: 8, paddingRight: 8 }}>{_id}</td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {name}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {formatCurrency(price)}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {category}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {brand}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {isActive === true ? '✅' : '❌'}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    <div className='flex justify-center gap-2'>
                      <Button
                        isIconOnly
                        className='btn-blue btn-sm'
                        onClick={() => {
                          navigate(`/admin/products/${_id}`)
                        }}
                        style={{ minWidth: 30 }}
                        title='Edit'
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>

                      <DeleteProductButton
                        productId={_id}
                        onProductDeleted={onProductDeleted}
                      />
                    </div>
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
