/* ========================================================================

===========================================================================

✅ ✅ Test absolute vs relative paths: '/random' vs  ['/products'] 'random' works.

  {
    path: '/products',
    children: [{ path: 'random', element: <PageProductRandom />, component: PageProductRandom }]
  },

vs.

  { path: '/random', element: <PageRandom />, component: PageRandom }


===========================================================================

===========================================================================


❓✅ Test [products] ':id/quantity' vs [products] ':storeId/location'
In actual practice we're testing something like '1/quantity' vs '1/location'.
Here both 'quantity' and 'location' are child routes if ':id' and ':storeId' respctively.
The test is to see if LinkPreload is smart enough to differentiate between two different
dynamic path segments based on the latter part of the string.


===========================================================================

===========================================================================


❓✅ Test [products] ':id' aka '1'.

  {
    path: ':id',
    component: PageProductDetails,
    children: [{ index: true, element: <PageProductDetails />, component: PageProductDetails }]
  },

===========================================================================

===========================================================================


✅✅ Test [products] ':id/:test' AKA 'abc/123' where both segments are actually dynamic. This is
not actually that complicated for getRouteFromPathParts(). First it finds
'/products'. Then it tries to find '123', but ultimately falls back to ':id'. Then
it tries to find 'abc', but ultimately falls back to ':test'.

  {
    path: '/products',
    children: [
      {
        index: true,
        element: <PageProductList />,
        component: PageProductList
      },
      {
        path: ':id',
        component: PageProductDetails,
        children: [
          {
            path: ':test',
            element: <PageProductDetailsTest />,
            component: PageProductDetailsTest
          }
        ]
      },
    ]
  }


===========================================================================

===========================================================================


✅✅  Test '/:id'  where '/' has a child of ':id' AKA '/abc'. Step 1 will fail to find a matching route for '/abc'.
Then other steps get skipped. If there was a '/:xxx' path it could also be potentially wrong.

If we completely fail on the first run of getRouteFromPathParts(), it's possible that we're dealing with the
'/' route. Thus, we should check if calledBy === 'handlePreload()'. If that's the case, then call
then call getRouteFromPathParts() again.



*/
