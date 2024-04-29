import { useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
// After manually modifying React Router location, we want to trigger something
// that will cause location to update in a way that can be watched. In other words,
// the manual modification does not alert React Router that location data has changed.
// Thus, suppose we do this:
//
//   location.search = `?page=${currentPage + n}`
//   window.history.replaceState('', '', `${location.pathname}?page=${currentPage + n}`)
//   updateLocation()
//
// But from the perspective of React Router nothing has changed. One trick to get around
// this is to setSearchParams back on itself. However, we then
// need to force a rerender, then setSearchParams back on itself.
// We wouldn't actually need to force a rerender if something in the consuming
// component did if for us, but just in case, that doesn't happen, I'm doing it here.
//
// This is where it gets weird because one way to force a rerender is to setSearchParams
// back on itself, but then you need to do it AGAIN.
//
// This feels pretty hacky, but it actually works! So far I haven't seen any bad.
// consequences. For example, you might think that setSearchParams will cause the
// useEffectto run every time the component that uses it rerenders, but that's not
// the case. setSearchParams seems to already be optimized for useEffect().
//
///////////////////////////////////////////////////////////////////////////

export const useUpdateLocation = (): VoidFunction => {
  const [, setSearchParams] = useSearchParams()

  useEffect(() => {
    // console.log('useUpdateLocation() useEffect ran().')
    setSearchParams((value) => {
      return value
    })
  }, [setSearchParams])

  return useCallback(() => {
    setSearchParams((value) => {
      return value
    })
  }, [setSearchParams])
}
