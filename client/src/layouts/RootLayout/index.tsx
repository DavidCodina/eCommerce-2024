// Third-party imports
import { Outlet } from 'react-router-dom'

// Custom imports
import {
  AppProvider,
  AuthProvider,
  CartProvider,
  ThemeProvider
} from 'contexts'

/* ========================================================================
                              RootLayout                      
======================================================================== */
// At this point, <AppProvider /> is INSIDE of the React Router, which means
// that AppContext can use React Router methods. However, we can't access
// AppContext until we go down one more level to <MainLayout />

export const RootLayout = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <Outlet />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </AppProvider>
  )
}

export default RootLayout
