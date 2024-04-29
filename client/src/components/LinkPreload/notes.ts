/* ========================================================================
                               Inspired by:
===========================================================================
https://blog.maximeheckel.com/posts/preloading-views-with-react/
https://omarelhawary.me/blog/file-based-routing-with-react-router-pre-loading/

This component will search for the component associated to a particular path.
It can handle simple relative paths ('random'), compound paths ('random/test'), dynamic
path (':id'). If a route can't be found for a path segment, it looks for
compound path segments. If a route can't be found for a compound path segment, it
looks for a dynamic path segment.

There are lots of more complex route patterns that getRouteFromPathParts() will
likely fail on. However, for the majority of use cases, getRouteFromPathParts()
works pretty well. The worst case scenario is simply that it fails to preload a
component, which isn't the end of the world.

Incidentally, it's kind of shocking that React Router doesn't even have this
feature. It makes me want to reach for Tanstack Router...

Currently, I don't think React Router has anything like this.
I'm not even sure if Remix does yet. In this proposal
https://github.com/remix-run/react-router/discussions/8012
the suggestion was made to do it on mouse enter, focus, and touch start.
This component should ultimately handle all three of those events as well.

===========================================================================
                              Usage
===========================================================================

  <LinkPreload
    // preload={false}
    showLogs={false}
    to='/random'
  >Random Page</LinkPreload>


Afterthought: The amount of work that it took to figure this all out was immense.
I've tested LinkPreload, and it seems to work very well. However, I'm not thrilled
about the need to also pass the routeList through context to avoid circular dependencies.
Ultimately, the manual implmentation of lazyWithPreload() seems so much easier.

  <Button
    onClick={() => { navigate('/about') }}
    onMouseEnter={() => LazyPageAbout.preload()}
    color='green'
  >Go to About</Button>

Alternatively, just preload your components on mount with a useTimeout.
Or if you're on a list page, then preload the details page, since it's
very likely someone will use it.

Update, you can also use React Router 6.4+ loader to block the Suspense fallback
when loading a page. And this TOTALLY alleviates the need for LinkPreload.


  export const LazyPageRandom = lazyWithPreload(() => import('pages/PageRandom'))

  // Because by default, loaders wait for the data before transitioning,
  // We can use the loader to import the component.
  // If you look at what he's actually doing in the implementation
  // we may not even need lazyWithPreload...
  // https://www.infoxicator.com/en/react-router-6-4-code-splitting
  export const randomLoader = async () => {
    // From what I can tell, .preload() will cache the import, so
    // that in subsequent requests it's essentially rendered synchronously.
    await LazyPageRandom.preload().then((component: any) => {
      // console.log('The component has been loaded:', component)
      // console.log('Now waiting three seconds.')
      return component
    })
    // await sleep(3000)
    // return null or get additional data and return that.
    return null
  }


  {
    path: '/random',
    element: <PageRandom />,
    //! component: PageRandom, // No need for this now...
    loader: randomLoader,
  },

===========================================================================
                            Gotcha
===========================================================================

Initially, LinkPreload was located in the components folder.
However, LinkPreload indirectly depends on components like PageHome,
PageAbout, etc. Conversely, Page components depend on components within
the components folder. Even if PageHome, PageAbout, etc. don't specifically
use LinkPreload this ultimately creates a circular dependency, which
shows up as a nasty error when using Hot Module Reloading.

For example, if you modify something in PageHome you get this message that
says something like cannot use PageHome before initialization, bla, bla, bla...
Long story short, the solution is to move LinkPreload out of the components
folder. For now, I've got it in the root, but I might try moving it into layouts.

That solves the basic problem with when updating PageHome and HMR.
But you'll get the same error IF you use LinkPreload in PageHome.
This time, it's easier to understand why.

Ultimately, the circular dependencies are stemming from import issues.
One way around this, is to store/access routeList using context.
That fixes it. This also means that we can now move LinkPreload back
into the components folder.

===========================================================================
                            Things Maybe To Do                      
===========================================================================

Todo: preloadDelay

https://tanstack.com/router/v1/docs/guide/preloading
By default, preloading will start after 50ms of the user hovering or touching
a <Link> component.

This is probably useful to avoid situations where the user swipes across an
entire list of links, and then ends up preloading the entire set, which
could potentially cause performance issues.
The goal would be set the function to run in 50ms, but to then opt out,
if hovering state turned false. For now, I have not implemented any of this.

Todo: Add focus feature.


*/
