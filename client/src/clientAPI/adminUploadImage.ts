type Data = string | null // i.e, the image url

type AdminUploadImageResponse = API_Response<Data>

type RequestData = FormData

type AdminUploadImage = (data: RequestData) => AdminUploadImageResponse

/* ========================================================================

======================================================================== */

export const adminUploadImage: AdminUploadImage = async (
  data
): ReturnType<AdminUploadImage> => {
  try {
    const res = await fetch(`/api/admin/upload`, {
      method: 'POST',
      credentials: 'include',
      body: data
    })

    const json = (await res.json()) as Awaited<ReturnType<AdminUploadImage>>

    return json
  } catch (err) {
    return {
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
