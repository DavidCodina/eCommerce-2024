type Data = User | null
type AdminSoftDeleteUserResponse = API_Response<Data>
type AdminSoftDeleteUser = (userId: string) => AdminSoftDeleteUserResponse

/* ========================================================================

======================================================================== */

export const adminSoftDeleteUser: AdminSoftDeleteUser = async (
  userId
): ReturnType<AdminSoftDeleteUser> => {
  try {
    const res = await fetch(`/api/admin/users/${userId}/soft-delete`, {
      method: 'PATCH',
      credentials: 'include'
    })

    const json = (await res.json()) as Awaited<ReturnType<AdminSoftDeleteUser>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
