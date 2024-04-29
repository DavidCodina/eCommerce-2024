import { Fragment, CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

import { Button } from 'components'
import { SimpleTable } from 'components/SimpleTable'
import { DeleteUserButton } from './DeleteUserButton'

type UserTableProps = {
  users: User[]
  onUserDeleted: () => void
}

const cols = [
  { key: '_id', label: 'ID' },
  { key: 'userName', label: 'User Name' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'roles', label: 'Roles' },
  { key: 'isActive', label: 'Is Active' },
  { key: 'createdAt', label: 'Created' },
  { key: 'actions', label: '' }
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
//# Ultimately, this table needs to be paginated.

export const UserTable = ({ users, onUserDeleted }: UserTableProps) => {
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
          {!Array.isArray(users) || users.length === 0 ? (
            <tr role='row'>
              <td
                className='pointer-events-none h-40 text-center align-middle font-medium'
                colSpan={cols.length}
                role='gridcell'
              >
                No users to display!
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const {
                _id,
                userName,
                firstName,
                lastName,
                email,
                phone,
                roles,
                isActive,
                createdAt
              } = user

              const formattedCreatedAt = new Date(createdAt).toLocaleDateString(
                undefined,
                { year: 'numeric', month: 'long', day: 'numeric' }
              )

              return (
                <tr key={_id} className='text-center'>
                  <td style={{ paddingLeft: 8, paddingRight: 8 }}>{_id}</td>
                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {userName}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {firstName} {lastName}
                  </td>

                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    <a
                      className='font-mono text-blue-500 hover:underline'
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                  </td>
                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {phone}
                  </td>
                  <td
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8
                    }}
                  >
                    {Array.isArray(roles) && roles.join(', ')}
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
                    {formattedCreatedAt}
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
                          navigate(`/admin/users/${_id}`)
                        }}
                        style={{ minWidth: 30 }}
                        title='Edit'
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>

                      <DeleteUserButton
                        userId={_id}
                        onUserDeleted={onUserDeleted}
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
