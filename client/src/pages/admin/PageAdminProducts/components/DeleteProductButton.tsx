import { useState } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import { sleep } from 'utils'
import { Button } from 'components'
import { adminSoftDeleteProduct } from 'clientAPI'

type DeleteProductButtonProps = {
  productId: string
  onProductDeleted: () => void
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
//  AI Prompt:
//
//   I have an Express.js application that is used for an eCommerce site. The database stores users,
//   products and orders. There are endpoints for regular users and for admin users.
//
//   On the front-end application there is an admin page that lists products. From there an admin can delete
//   a product. However, if a product is deleted from the database then I could end up with a bunch of orders
//   that reference products that no longer exist in the database. That seems like a bad design.
//
//   I'm new to building APIs for eCommerce, so I'm unfamiliar with the standard architectural patterns. What
//   would you suggest I do instead of deleting the product entirely. Ultimately, I think I want to remove the
//   product from the products being shown in the store, but I probably don't want to entirely remove the product
//   from the database.
//
//   AI Response:
//
//   You're correct in identifying the potential issue with deleting products that have existing orders referencing them.
//   This could lead to data inconsistency and integrity issues in your application. Instead of physically deleting the
//   product from the database, a common pattern is to implement a soft delete or deactivation mechanism.
//
//   Here's how you could approach this:
//
//     1. Add a status field to the product model: In your product schema or model, add a field (e.g., isActive or status) that
//     indicates whether the product is currently active or not. By default, new products would have this field set to true (active).
//
//     2. Modify the delete endpoint: Instead of deleting the product from the database, update the product's status field to mark
//     it as inactive (e.g., set isActive to false or status to inactive).
//
//     3. Modify product listing and retrieval: When listing or retrieving products, add a filter or condition to only include active
//     products (e.g., isActive: true or status: 'active'). This way, inactive products will no longer appear in the store or be
//     available for purchase.
//
//     4. Handle orders with inactive products: When creating a new order or retrieving existing orders, you may want to include
//     the product details as they were at the time of the order. This ensures that you have a historical record of the product information, even if the product is later deactivated or its details are updated.
//
//   By following this approach, you can effectively remove products from the store without losing the reference to them in existing orders.
//   This preserves data integrity and allows you to maintain a historical record of orders and the products associated with them.
//
///////////////////////////////////////////////////////////////////////////

export const DeleteProductButton = ({
  onProductDeleted,
  productId
}: DeleteProductButtonProps) => {
  const [deleteStatus, setDeleteStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  /* ======================
  handleSoftDeleteProduct()
  ====================== */

  const handleSoftDeleteProduct = async (productId: string) => {
    const confirmed = confirm('Are you sure you want to delete this product?')

    if (!confirmed) {
      return
    }

    setDeleteStatus('pending')

    adminSoftDeleteProduct(productId)
      .then(async (json) => {
        await sleep(1500)

        const { success } = json

        if (success === true) {
          setDeleteStatus('success')

          onProductDeleted?.() // Calls getProducts, etc.
        } else {
          toast.error('Unable to soft delete product.')
          setDeleteStatus('error')
        }
        return json
      })
      .catch((err) => {
        toast.error('Unable to soft delete product.')
        setDeleteStatus('error')
        return err
      })
  }

  /* ======================
          return
  ====================== */

  return (
    <Button
      loading={deleteStatus === 'pending'}
      isIconOnly
      className='btn-red btn-sm'
      onClick={() => {
        handleSoftDeleteProduct(productId)
      }}
      style={{ minWidth: 30 }}
      title='Soft Delete'
    >
      <FontAwesomeIcon icon={faTrash} />
    </Button>
  )
}
