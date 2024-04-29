// Third-party imports
import { createRoutesFromElements, Route, Navigate } from 'react-router-dom'

// Custom imports

import { RootLayout, MainLayout } from 'layouts'
import { PrivateRoutes } from './PrivateRoutes'
import PageHome from 'pages/PageHome' // Should NOT be lazy loaded.
import PageStore from 'pages/PageStore'

import PageStoreClientFilter from 'pages/PageStoreClientFilter'

import PageProduct from 'pages/PageProduct'
import PageCart from 'pages/PageCart'
import PageCheckout from 'pages/PageCheckout'

import PageOrders from 'pages/PageOrders'
import PageOrder from 'pages/PageOrder'

import PageLogin from 'pages/PageLogin'
import PageRegister from 'pages/PageRegister'
import PageProfile from 'pages/PageProfile'

import PageSuccess from 'pages/PageSuccess'
import PageCancel from 'pages/PageCancel'

import PageNotFound from 'pages/PageNotFound' // Should NOT be lazy loaded.
import PageUnauthorized from 'pages/PageUnauthorized'

import PageAdminOrders from 'pages/admin/PageAdminOrders'
import PageAdminOrder from 'pages/admin/PageAdminOrder'

import PageAdminProducts from 'pages/admin/PageAdminProducts'
import PageAdminProduct from 'pages/admin/PageAdminProduct'
import PageAdminCreateProduct from 'pages/admin/PageAdminCreateProduct'

import PageAdminUsers from 'pages/admin/PageAdminUsers'
import PageAdminUser from 'pages/admin/PageAdminUser'

import {
  LazyPageErrorDemo as PageErrorDemo,
  loader as pageErrorDemoLoader
} from 'pages/PageErrorDemo'

/* ========================================================================
                                   Routes      
======================================================================== */

export const routes = createRoutesFromElements(
  <Route element={<RootLayout />}>
    <Route element={<MainLayout />}>
      <Route path='/' element={<PageHome />} />

      <Route path='/register' element={<PageRegister />} />
      <Route path='/login' element={<PageLogin />} />

      <Route path='/home' element={<Navigate to='/' replace />} />
      <Route path='/store' element={<PageStore />} />

      {/* This page demonstrates the use of client filters against the products data. 
      It was an earlier version before moving to the API filters. However, it's still
      a decent example of client-side filtering. */}
      <Route path='/store-client-filter' element={<PageStoreClientFilter />} />

      <Route path='/products/:id' element={<PageProduct />} />
      <Route path='/cart' element={<PageCart />} />
      <Route path='/checkout' element={<PageCheckout />} />

      <Route path='/success' element={<PageSuccess />} />
      <Route path='/cancel' element={<PageCancel />} />

      <Route element={<PrivateRoutes />}>
        <Route path='/profile' element={<PageProfile />} />
        <Route path='/orders' element={<PageOrders />} />
        <Route path='/orders/:id' element={<PageOrder />} />
      </Route>

      <Route element={<PrivateRoutes allowedRoles={['admin'] as any} />}>
        <Route path='/admin/orders' element={<PageAdminOrders />} />
        <Route path='/admin/orders/:id' element={<PageAdminOrder />} />

        <Route path='/admin/products' element={<PageAdminProducts />} />
        <Route path='/admin/products/:id' element={<PageAdminProduct />} />

        <Route
          path='/admin/products/create'
          element={<PageAdminCreateProduct />}
        />

        <Route path='/admin/users' element={<PageAdminUsers />} />
        <Route path='/admin/users/:id' element={<PageAdminUser />} />
      </Route>

      <Route
        path='/error-demo'
        element={<PageErrorDemo />}
        loader={pageErrorDemoLoader}
      />

      <Route path='/unauthorized' element={<PageUnauthorized />} />
      <Route path='*' element={<PageNotFound />} />
    </Route>
  </Route>
)
