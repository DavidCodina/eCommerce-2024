// Third-party imports
import { useState } from 'react'

// Custom imports
import { useTitle } from 'hooks'
import { Button, HR, Title, Waves } from 'components'
export * from './loader'

/* ========================================================================
                              PageErrorDemo
======================================================================== */
//////////////////////////////////////////////////////////////////////////
//
// Test react-error-boundary synchronous:
//
//   let condition = false
//   condition = true
//   if (condition) {
//     throw Error('Error: A page in the app crashed!')
//   }
//
// Test react-error-boundary asynchronous:
// (needs: import { useErrorHandler } from 'react-error-boundary')
//
//   const handleError = useErrorHandler()
//   setTimeout(() => {
//     try {
//       throw new Error('Kaboom!')
//     } catch (err) {
//       handleError(err)
//     }
//   }, 3000)
//
// Test react-error-boundary rerender:
// In the async example above, we manually had to catch the error then set it using
// react-error-boundary's useErrorHandler. That said, react error boundary will
// trigger on rerender when something goes wrong (no  need to manually set anything).
// The point being that async code itself will not trigger an error boundary, but
// the potential results of an async API call would possibly trigger the error boundary
// once the data was set in state.
//
//   const [items, setItems] = useState<any>([])
//
//   <Button
//     className='block mx-auto'
//     color='green'
//     onClick={() => { setItems(undefined) }}
//   >
//     Break The Page!
//   </Button>
//
//   {items.map(() => null)}
//
// Note: React error boundaries do not handle compilation time errors.
// For example, putting abc123 in your code (i.e. an undefined variable)
// Thus, an uncaught reference error will NEVER trigger react error boundary.
// Instead this triggers the webpack error overlay.
//
///////////////////////////////////////////////////////////////////////////

const PageErrorDemo = () => {
  useTitle('Error Demo')

  const [items, setItems] = useState<any>([])

  /* ======================
          return
  ====================== */

  return (
    <div
      // The parent is <div id='root'>, which has display: flex; flex-direction: column; min-height: 100vh;
      // 'flex-1' is used to make the page stretch vertically and fill up remaining space.
      // 'mx-auto' is used to center the container horizontally.
      // However, because the page element is a flex child, mx-auto may inadvertantly squish the content.
      // Conversely, 'mx-auto' can also cause content to bleed out of the bounds of the viewport.
      // To correct for this, we can use 'w-full'.
      // 'container' will overwrite 'w-full' when needed.
      className='mx-auto w-full flex-1 p-6 2xl:container'
    >
      <Title
        style={{
          marginBottom: 50,
          textAlign: 'center'
        }}
      >
        Error Boundary Demo
      </Title>

      <HR style={{ marginBottom: 50 }} />

      <Button
        onClick={() => {
          setItems(undefined)
        }}
        className='btn-red btn-sm mx-auto block'
        style={{ cursor: 'pointer', margin: '0 auto' }}
      >
        Break The Page!
      </Button>

      {items.map(() => null)}

      <Waves />
    </div>
  )
}

export default PageErrorDemo
