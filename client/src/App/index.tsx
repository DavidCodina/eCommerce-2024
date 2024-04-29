import { Fragment } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

/* ========================================================================

======================================================================== */

function App() {
  return (
    <Fragment>
      <RouterProvider router={router} />
    </Fragment>
  )
}

export default App
