import { useRef } from 'react'
import { Link, useResolvedPath } from 'react-router-dom'
import { useAppContext } from 'contexts'
import { log } from 'utils'
import { ILinkPreload, Route, MaybeRoute } from './types'

let isDevelopment = false
try {
  isDevelopment = import.meta.env.DEV
} catch (err) {
  void err
}

/* ========================================================================
                              LinkPreload         
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// React Router can handle compound paths such that '/products/info' can
// point to a resource that is NOT a child of '/products'. In other words
// the entire '/products/info' route could be a sibling of the '/products' route.
// In practice, however, determining whether a 'to' path or some fragment of it
// should be treated as parent/child or just parent a compound parent is
// surprisingly difficult!
//
// Consequently, this component is intended to work ONLY with non-compound
// paths, such that a 1:1 relationship is ASSUMED between a path segment and
// a route. In other words, '/products/info' will always be interpreted
// as 'info' being a child of '/products'.
//
// Consequently, in order for LinkPreload to work as expected, there needs
// to be a consistent convention in how the route definitions are defined.
//
// Even though React Router itself is more flexible, WE need to adhere to
// a stricter convention such that one ALWAYS defines routes in a manner
// that is consistently parent/child and that NEVER has a compound path
// pointing to a single resource.
//
// Initially, this component tried to handle compound paths, but the
// recursive logic gets wildly complex. That said, there's really nothing
// limiting about using strictly parent/child, 1:1 route definitions, and
// if one does that then this component WILL WORK AS EXPECTED!
//
///////////////////////////////////////////////////////////////////////////

export const LinkPreload = ({
  preload = true,
  showLogs = false,
  to,
  ...otherProps
}: ILinkPreload) => {
  showLogs = showLogs && isDevelopment
  /* ======================
        variables
  ====================== */

  const resolvedPath = useResolvedPath(to)
  const TO = (to as string)?.split('?')[0] || ''
  const toStartsWithSlash = TO?.startsWith('/')

  // Ultimately, end slashes are removed in the next steps, but this MIGHT be useful to know...
  const _toEndsWithSlash = TO?.endsWith('/')
  const fullPath = resolvedPath.pathname

  ///////////////////////////////////////////////////////////////////////////
  //
  // resolvedPath.pathname will produce the full path for the given 'to',
  // while parsing out any search parameters into resolvedPath.search.
  // That said, if your 'to' is relative (e.g., 'random'), and you're in
  // '/posts', which has no child 'random' route, then it will not work.
  // This just means you made a mistake at the level of your 'to' prop.
  //
  // Note: one could potentially pass a 'to' path of '/products?name=blender',
  // or '/products/?name=blender'. In the latter case, the resolvedPath.pathname
  // becomes '/products/'. However, toParts splits on '/', and filters out '',
  // which means that any trailing slash will ultimately get omitted.
  //
  // The important point here is that if one defines routes with trailing slashes,
  // then getRouteFromPathParts() will ultimately fail to find them. One way to
  // mitigate this possibility is to remove any trailing slashes from the path
  // property in the cloning functions in routes.tsx.
  //
  // However, a better approach is to test for both possibilities here. For example,
  //
  //   route?.path === currentPathPart || route?.path === `${currentPathPart}/`
  //
  ///////////////////////////////////////////////////////////////////////////

  // Split 'TO' into parts and filter out any potential '' that
  // could occur from leading or trailing slashes.
  const toParts = TO?.split('/').filter((part) => !!part)
  // If the 'TO' value initially had a starting slash, then add it back to the first part.
  toParts[0] = toStartsWithSlash ? `/${toParts[0]}` : (toParts[0] as string)

  const fullPathParts = fullPath?.split('/').filter((part) => !!part)
  // The fullPath always has a starting slash, so add it back to the first part.
  fullPathParts[0] = `/${fullPathParts?.[0]}` || ''

  const fullPathPartsLength = fullPathParts?.length || 0

  const alertMessage = `Whoops! <LinkPreload /> was unable to find a matching route for:

'${to}' 

In order for <LinkPreload /> to work correctly, the associated route definition must adhere to a parent/child format, and each path segment must have a 1:1 relationship with a route. In other words, compound paths pointing to a single route will not work.

React Router itself can use compound paths to point to a single route. For example, '/products/info' could point to a non-child route (i.e., '/products' & '/products/info' could be siblings). 

<LinkPreload />, on the other hand, is more limitied in its ability to parse path strings. However, if the route definitions are implemented in a stricter format, then <LinkPreload /> will work as expected!

Also make sure that the 'to' value passed to <LinkPreload /> is correct.`

  /* ======================
        state & refs
  ====================== */

  const { routeList }: any = useAppContext() //! This does not actually exist in AppContext right now.
  const hasRunOnceRef = useRef(false)

  /* ======================
    getRouteFromPathParts()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // This function will run recursively as needed. With recursive functions
  // there is the possibility of inadvertantly creating an infinite loop.
  // I believe I've been careful about preventing that, but you could
  // also implement some kind of failsafe where all executions of the function
  // will be killed after some point. This could be done by setting a timeout
  // in handlePreload() that then sets a ref after 1 second, then inside of
  // getRouteFromPathParts() every execution conditionally runs based on
  // that value. For this it's best to use a ref instead of state. Otherwise,
  // you can potentially run into lexical scoping issues. Here's a kind of
  // similar example  of how the implementation would go:
  //
  //   const shouldRunRef = useRef(true)
  //
  //   useEffect(() => {
  //     const infiniteLoop = async () => {
  //       // Conditionally kill the execution cycle:
  //       if (shouldRunRef.current === false) { return }
  //
  //       console.log('I will run forever if not stopped!', new Date().toLocaleTimeString())
  //
  //       await new Promise((resolve) => setTimeout(resolve, 1000))
  //       infiniteLoop()
  //     }
  //
  //     // Failsafe:
  //     // This could also be done within the function itself...
  //     setTimeout(() => { shouldRunRef.current = false }, 5000)
  //     infiniteLoop()
  //   }, [])
  //
  ///////////////////////////////////////////////////////////////////////////

  const getRouteFromPathParts = (
    currentRouteList: Route[],
    currentIndex: number,
    currentPathPart: string,
    calledBy: 'start' | 'test' | 'step3' | 'step5'
  ): MaybeRoute => {
    /* ======================
          Execution Log
    ====================== */

    if (showLogs) {
      log(
        `\n New execution: currentIndex: '${currentIndex}', currentPathPart: '${currentPathPart}', calledBy: ${calledBy}. `,
        {
          background: '#50BFE6'
        }
      )
    }
    /* ======================
          Early Return
    ====================== */

    if (!to || typeof to !== 'string') {
      if (showLogs) {
        console.log(
          "Returning null from getRouteFromPathParts() because 'to' was falsy, or not a string."
        )
      }
      return null
    }

    /* ======================
          Variables
    ====================== */

    let route: MaybeRoute = null

    const dynamicRoutes = currentRouteList.filter(
      (route) =>
        typeof route?.path === 'string' &&
        // Also check for '/:' just in case it's the '/' path.
        (route?.path?.startsWith(':') || route?.path?.startsWith('/:'))
    )

    /* ======================
            Step 1
    ====================== */
    // This should always find the first currentPathPart (e.g., '/about'),
    // except for cases of leading slash ambiguity (i.e., intended as '/' with a child of 'about').

    route = currentRouteList.find((route: any) => {
      return (
        route?.path === currentPathPart || route?.path === `${currentPathPart}/`
      )
    })

    if (route) {
      if (showLogs) {
        log(` Step 1: Route found for: '${route?.path}'. `)
        console.log(route)
      }
    }

    /* ======================
    Step 2: Dynamic Route (Not lat path part)
    ====================== */
    // If there's additional path parts beyond currentPathPart, then
    // try to make an educated guess of which dynamic route to choose,
    // based on a successful match for the nextRoute.

    if (!route) {
      if (currentIndex + 1 < fullPathPartsLength && dynamicRoutes.length > 1) {
        for (let i = 0; i < dynamicRoutes.length; i++) {
          const maybeRoute = dynamicRoutes[i]

          if (maybeRoute?.children) {
            const nextRoute = getRouteFromPathParts(
              maybeRoute.children,
              currentIndex + 1,
              fullPathParts[currentIndex + 1] as string,
              'test'
            )

            if (nextRoute) {
              route = maybeRoute
              if (showLogs) {
                log(
                  `\n Step 2: A dynamic route of '${route?.path}' was selected based on the presence of a matching child in the next currentPathPart.'`
                )
                console.log(route)
              }

              break
            }
          }
        }
      }
    }

    /* ======================
    Step 3: Split pathPart 1 
    ====================== */
    //# We may be able to remove this by integrating it into step 1.
    ///////////////////////////////////////////////////////////////////////////
    //
    // Try treating an initial '/xxx' as '/' and 'xxx' just in case you're dealing
    // with the home route.
    //
    // Here is a very imortant point: React Router matches child routes BEFORE
    // other, subsequent sibling routes. In practice, this means that we want
    // the check below to run BEFORE the fallback.
    //
    // If '/' has children, then do a recursive check to see if a matching route
    // can be found by treating '/abc' as '/' with a child of 'abc'
    //
    ///////////////////////////////////////////////////////////////////////////

    if (!route && calledBy === 'start') {
      const homeRoute = currentRouteList.find((route: any) => {
        return (route.path = '/')
      })

      if (homeRoute && homeRoute?.children) {
        route = getRouteFromPathParts(
          homeRoute.children,
          currentIndex, // Do NOT + 1. If you do that here, it will throw everything off.
          currentPathPart.substring(1),
          'step3'
        )

        if (route) {
          if (showLogs) {
            log(
              `\n Step 3: Route path of '${route?.path}' found for: '${currentPathPart}' by treating the initial '/xxx' as '/' with a child of 'xxx'.`
            )
            console.log(route)
          }
        }
      }
    }

    /* ======================
      Step 4: Fallback Route
    ====================== */

    if (!route && calledBy !== 'test' && dynamicRoutes[0]) {
      route = dynamicRoutes[0]

      if (showLogs) {
        log(
          `\nStep 4: Could not find a matching route for '${currentPathPart}', so falling back to the first dynamic path of '${route?.path}'.`
        )
        console.log(route)
      }
    }

    /* ======================
            Step 5
    ====================== */

    if (route) {
      if (route.children && currentIndex + 1 < fullPathPartsLength) {
        route = getRouteFromPathParts(
          route.children,
          currentIndex + 1,
          fullPathParts[currentIndex + 1] as string,
          'step5'
        )
      }
    }

    // Sometimes this won't run when it SHOULD because the function may
    // be returning a route (correctly), while the developer made some
    // sort of implementation error in the 'to' prop, or route definition.
    if (!route && isDevelopment && showLogs) {
      alert(alertMessage)
    }

    return route
  }

  /* ======================
      handlePreload()
  ====================== */

  const handlePreload = async () => {
    if (!preload || hasRunOnceRef.current === true) {
      return
    }

    const route = getRouteFromPathParts(
      routeList,
      0,
      fullPathParts[0] as string,
      'start'
    )
    hasRunOnceRef.current = true

    if (route) {
      if (showLogs) {
        console.log('\nFinal route:', route)
      }

      if (route?.component && 'preload' in route.component) {
        if (showLogs) {
          console.log(`Preloading '${to}' AKA '${route?.path}'.`)
        }
        route.component?.preload?.()
      }
    } else {
      if (showLogs) {
        log(` Route not found for path of '${to}'. `, { background: '#FF355E' })
      }
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <Link
      to={to}
      onMouseEnter={async () => {
        ///////////////////////////////////////////////////////////////////////////
        //
        // A lot of conditional chaining has been used within within handlePreload().
        // This is to avoid any unforeseen errors TypeErrors, etc. However, as an added
        // precaution, the function call has been wrapped in a try/catch. If handlePreload()
        // is unable to successfully find a route that's okay, but if handlePreload()
        // accidentally creates a  fatal error, then that's real bad!
        //
        ///////////////////////////////////////////////////////////////////////////
        try {
          handlePreload()
        } catch (err) {
          void err
        }
      }}
      {...otherProps}
    />
  )
}
