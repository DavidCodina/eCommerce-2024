import { useState } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import { sleep } from 'utils'
import { Button } from 'components'
import { adminSoftDeleteUser } from 'clientAPI/adminSoftDeleteUser'

type DeleteUserButtonProps = {
  userId: string
  onUserDeleted: () => void
}

/* ========================================================================

======================================================================== */

export const DeleteUserButton = ({
  onUserDeleted,
  userId
}: DeleteUserButtonProps) => {
  const [deleteStatus, setDeleteStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  /* ======================
    handleSoftDeleteUser()
  ====================== */

  const handleSoftDeleteUser = async (userId: string) => {
    setDeleteStatus('pending')

    adminSoftDeleteUser(userId)
      .then(async (json) => {
        await sleep(1500)

        const { success } = json

        if (success === true) {
          setDeleteStatus('success')
          onUserDeleted?.() // Calls getUsers, etc.
        } else {
          toast.error('Unable to soft delete user.')
          setDeleteStatus('error')
        }
        return json
      })
      .catch((err) => {
        toast.error('Unable to soft delete user.')
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
        handleSoftDeleteUser(userId)
      }}
      style={{ minWidth: 30 }}
      title='Soft Delete'
    >
      <FontAwesomeIcon icon={faTrash} />
    </Button>
  )
}
