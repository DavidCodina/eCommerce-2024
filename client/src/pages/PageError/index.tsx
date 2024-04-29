// Third-party imports
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faHome } from '@fortawesome/free-solid-svg-icons'

// Custom imports
import { useTitle } from 'hooks'
import { Button, HR, Title, Waves } from 'components'
import sadPanda from './sad-panda.png'

/* ========================================================================
                                 PageError
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://templates.mainstem.io/images/sad-panda.png
// Initially, I tried to wrap the entire <Router /> component with ErrorBoundary.
// At first this didn't work because the entire <Router /> would go down,
// and this meant that even navigating to a different page would still fail because
// rendering the new page depended on the <Router />.
//
// An alternate solution would be to wrap EACH <Route /> with an ErrorBoundary,
// but that would be tedious. Fortunately, we can reset the error boundary when
// whenever the location object changes.
//
// The React Error Boundary documenatation (https://reactjs.org/docs/error-boundaries.html)
// indicates that Error boundaries do not catch errors for:
//
//   - Event handlers (learn more)
//   - Asynchronous code (e.g. setTimeout or requestAnimationFrame callbacks)
//   - Server side rendering
//   - Errors thrown in the error boundary itself (rather than its children)
//
// That said, this doesn't mean that the error boundary will only work component mount.
// Rather, it will trigger whenever the view rerenders. Thus doing this kind of thing
// will still trigger the error boundary:
//
//   const [items, setItems] = useState<any>([])
//   useEffect(() => { setTimeout(() => { setItems(undefined)  }, 3000) }, [])
//   ...
//   {items.map(() => null)}
//
// That said, if we wanted to trigger an error boundary for one of the above listed
// cases, we could also manually set the error using react-error-boundary's
// useErrorHandler.
//
///////////////////////////////////////////////////////////////////////////

const PageError = ({ error, resetErrorBoundary }: any) => {
  useTitle('Error')
  const navigate = useNavigate()
  const location = useLocation()
  const [imgLoaded, setImgLoaded] = useState(false)

  /* ======================
        useEffect()
  ====================== */
  // location will change every time navigate() is called, even if
  // one is navigating to the same page. Why? Because location is a
  // new object reference every time. Whenever location changes,
  // we want to reset the error boundary.
  //
  // Gotcha: Resetting the error boundary from within the useEffect body
  // will causes an infinite loop. What we actually need to do is
  // call it from within the clean up function.

  useEffect(() => {
    console.log('location is now: ', location)
    return () => {
      resetErrorBoundary()
    }
  }, [location, resetErrorBoundary])

  /* ======================
      renderContent()
  ====================== */
  // There was an issue where it took the browser a half second to load the image.
  // This resulted in the text rendering, then the image blinking in a momement later.
  // One strategy to prevent this type of behavior is to use onLoad, and wait until
  // the image is ready before showing anything. To do this, a dummy img is first rendered
  // with display:none. Once onLoad happens, the image is now cached in browser memory, and
  // we can unmount that and instead render the actual content.

  const renderContent = () => {
    if (!imgLoaded) {
      return (
        <img
          alt='Sad Panda'
          src={sadPanda}
          style={{ display: 'none' }}
          onLoad={() => {
            setImgLoaded(true)
          }}
        />
      )
    }

    return (
      <div style={{ textAlign: 'center' }}>
        <img
          alt='Sad Panda'
          className='inline-block'
          src={sadPanda} // 'https://templates.mainstem.io/images/sad-panda.png'
          style={{ marginBottom: 25, maxHeight: '150px' }}
        />

        <h3 style={{ color: '#409', fontWeight: 'bold' }}>Uh Oh...</h3>

        {import.meta.env.DEV && error.message && (
          <p
            style={{
              color: '#FF355E',
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: 10
            }}
          >
            {error.message}
          </p>
        )}

        <p style={{ fontSize: 14, margin: '0 auto 25px auto', maxWidth: 450 }}>
          It looks like something did not go as expected. Our team has been
          notified about this error and we will look into it right away!
        </p>

        <div className='flex items-center justify-center gap-4'>
          <Button
            className='btn-blue btn-sm'
            onClick={() => {
              // Initialy, I tried calling resetErrorBoundary() here after the
              // navigate(). However, that doesn't work because the error ends
              // up reoccurring before navigate completes. Ultimately, we need
              // the location to change first, THEN we reset the error boundary. This
              // synchronous process can be accomplished with a useEffect (above).
              navigate('/')
            }}
            style={{ minWidth: 100 }}
          >
            <FontAwesomeIcon icon={faHome} style={{ marginRight: 5 }} />
            Go Home
          </Button>
          <Button
            className='btn-blue btn-sm'
            onClick={() => {
              // From the user's perspective, PageError is an actual page.
              // Thus, going back would entail going back to the page that
              // initially broke. Thus, we probably want resetErrorBoundary()
              // and not navigate(-1)
              resetErrorBoundary()
              // navigate(-1)
            }}
            style={{ minWidth: 100 }}
          >
            <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: 5 }} />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <div className='mx-auto w-full flex-1 p-6 2xl:container'>
      <Title
        style={{
          marginBottom: 50,
          textAlign: 'center'
        }}
      >
        Error
      </Title>

      <HR style={{ marginBottom: 50 }} />

      {renderContent()}

      <Waves />
    </div>
  )
}

export default PageError
