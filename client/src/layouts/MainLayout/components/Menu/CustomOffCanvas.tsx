import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faGear,
  // faInfo,
  // faChevronUp,
  faChevronDown,
  faSun,
  faMoon,
  faStore,
  // faPlusCircle,
  // faGauge,
  faRightFromBracket,
  faRightToBracket,
  faUserCircle,
  faUserPen,
  faClipboardCheck,
  faUserGear
} from '@fortawesome/free-solid-svg-icons'

// Custom imports
import { OffCanvas } from 'components/OffCanvas'
import { useThemeContext, useAuthContext } from 'contexts'

interface IMenu {
  duration?: number
  showMenu: boolean
  setShowMenu: Dispatch<SetStateAction<boolean>>
}

const linkStyle = `
relative
block
px-4
py-2
text-xl 
font-bold 
text-indigo-800 
no-underline 
hover:before:absolute
hover:before:top-2
hover:before:bottom-0 
hover:before:left-2
hover:before:h-[calc(100%-16px)]
hover:before:w-[3px]
hover:before:rounded-full
hover:before:bg-indigo-800
hover:text-indigo-800
focus-visible:shadow-[inset_0_0_0_2px_theme(colors.indigo.800)] 
dark:focus-visible:shadow-[inset_0_0_0_2px_var(--tw-dark-primary-color)]
focus:outline-none
dark:text-[var(--tw-dark-primary-color)] 
`

const activeLinkStyle = `
relative
block 
px-4
py-2
text-xl 
font-bold 
no-underline 
bg-indigo-800
text-white
hover:before:absolute
hover:before:top-2
hover:before:bottom-0 
hover:before:left-2
hover:before:h-[calc(100%-16px)]
hover:before:w-[3px]
hover:before:rounded-full
hover:before:bg-white
hover:text-white
focus-visible:shadow-[inset_0_0_0_2px_theme(colors.sky.300)]
dark:focus-visible:shadow-[inset_0_0_0_2px_var(--tw-dark-primary-color)]
focus:outline-none
dark:text-[var(--tw-dark-primary-color)] 
`

/* ========================================================================
                            CustomOffCanvas
======================================================================== */

export const CustomOffCanvas = ({
  showMenu,
  setShowMenu,
  duration = 300
}: IMenu) => {
  const location = useLocation()
  const { logOut, authData } = useAuthContext()
  const { mode, setMode } = useThemeContext()
  const [showAdmin, setShowAdmin] = useState(false)

  const isAdmin =
    authData &&
    Array.isArray(authData?.roles) &&
    authData.roles.includes('admin')
      ? true
      : false

  /* ======================
        handleClose()
  ====================== */

  const handleClose = () => {
    // This is a hacky way to get the OffCanvas to close (i.e., not declarative).
    // const body = document.getElementsByTagName('body')[0]; body?.click()
    setShowMenu(false)
  }

  /* ======================
        getClassName()
  ====================== */

  const getClassName = (isActive: boolean) => {
    if (isActive) {
      return activeLinkStyle
    }

    return linkStyle
  }

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    const modeHoverColors = {
      light: 'hover:text-indigo-800',
      dark: 'dark:opacity-75 dark:hover:opacity-100 hover:dark:text-[var(--tw-dark-primary-color)]'
    }

    //! We shouldn't have to use mode here...
    const modeHoverColor = modeHoverColors[mode]

    return (
      <div className='flex justify-between px-4 py-2'>
        <button
          onClick={() => {
            setMode((v) => (v === 'light' ? 'dark' : 'light'))
          }}
          className={`cursor-pointer text-2xl opacity-50 hover:opacity-100 ${modeHoverColor}`}
          style={{}}
          title='Toggle Light/Dark Mode'
        >
          <FontAwesomeIcon className='dark:hidden' icon={faSun} />
          <FontAwesomeIcon className='hidden dark:block' icon={faMoon} />
        </button>

        {/* <OffCanvas.CloseButton onClose={() => setShowMenu(false)} /> */}

        {/* https://heroicons.com/ */}
        <button className='m-0 p-0' onClick={() => setShowMenu(false)}>
          <svg
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2.5}
            stroke='currentColor'
            className={`block h-8 w-8 cursor-pointer opacity-50 hover:text-indigo-800 hover:opacity-100 dark:opacity-75 dark:hover:text-[var(--tw-dark-primary-color)] dark:hover:opacity-100`}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>
    )
  }

  /* ======================
      renderAdminLinks()
  ====================== */

  const renderAdminLinks = () => {
    if (!isAdmin) {
      return null
    }
    return (
      <div
        style={{
          marginBottom: showAdmin ? 16 : 0
        }}
      >
        <button
          className={
            location.pathname.startsWith('/admin') ? activeLinkStyle : linkStyle
          }
          style={{
            alignItems: 'center',
            display: 'flex',
            marginBottom: showAdmin ? 16 : 0,
            textAlign: 'left',
            width: '100%'
          }}
          onClick={() => setShowAdmin((v) => !v)}
        >
          <FontAwesomeIcon icon={faGear} style={{ marginRight: 10 }} />
          <span>Admin</span>

          <FontAwesomeIcon
            icon={faChevronDown}
            style={{
              marginLeft: 'auto',
              marginTop: showAdmin ? 0 : -5,
              transform: showAdmin ? 'rotate(180deg)' : ''
            }}
          />
        </button>

        {showAdmin && (
          <>
            <NavLink
              className={({ isActive }) => getClassName(isActive)}
              to={
                location.pathname === '/admin/orders' && location.search
                  ? `/admin/orders${location.search}`
                  : '/admin/orders'
              }
              onClick={handleClose}
              style={{
                borderRadius: 16,
                fontSize: 16,
                margin: '0px 16px',
                paddingTop: 8,
                paddingBottom: 8
              }}
            >
              <FontAwesomeIcon icon={faUserGear} style={{ marginRight: 10 }} />
              Orders
            </NavLink>

            <NavLink
              className={(_props) => {
                const isActive = location.pathname === '/admin/products'
                // Gotcha: By default props.isActive will be true for any path that
                // matches the first segment. Thus if we explicitly want to
                // differentiate between '/admin/products' and '/admin/products/create',
                // we need to use location.pathname to create our own isActive
                return getClassName(isActive)
              }}
              to={
                location.pathname === '/admin/products' && location.search
                  ? `/admin/products${location.search}`
                  : '/admin/products'
              }
              onClick={handleClose}
              style={{
                borderRadius: 16,
                fontSize: 16,
                margin: '0px 16px',
                paddingTop: 8,
                paddingBottom: 8
              }}
            >
              <FontAwesomeIcon icon={faUserGear} style={{ marginRight: 10 }} />
              Products
            </NavLink>

            {/* <NavLink
              className={(_props) => {
                const isActive = location.pathname === '/admin/products/create'
                return getClassName(isActive)
              }}
              to={
                location.pathname === '/admin/products/create' &&
                location.search
                  ? `/admin/products/create${location.search}`
                  : '/admin/products/create'
              }
              style={{
                borderRadius: 16,
                fontSize: 16,
                margin: '0px 16px',
                paddingTop: 8,
                paddingBottom: 8
              }}
              onClick={handleClose}
            >
              <FontAwesomeIcon
                icon={faPlusCircle}
                style={{ marginRight: 10 }}
              />
              Create Product
            </NavLink> */}

            <NavLink
              className={({ isActive }) => getClassName(isActive)}
              to={
                location.pathname === '/admin/users' && location.search
                  ? `/admin/users${location.search}`
                  : '/admin/users'
              }
              onClick={handleClose}
              style={{
                borderRadius: 16,
                fontSize: 16,
                margin: '0px 16px',
                paddingTop: 8,
                paddingBottom: 8
              }}
            >
              <FontAwesomeIcon icon={faUserGear} style={{ marginRight: 10 }} />
              Users
            </NavLink>
          </>
        )}
      </div>
    )
  }

  /* ======================
      renderNavLinks()
  ====================== */

  const renderNavLinks = () => {
    return (
      <Fragment>
        <NavLink
          className={({ isActive }) => getClassName(isActive)}
          to={
            location.pathname === '/' && location.search
              ? `/${location.search}`
              : '/'
          }
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faHome} style={{ marginRight: 10 }} />
          Home
        </NavLink>

        <NavLink
          className={({ isActive }) => getClassName(isActive)}
          to={
            location.pathname === '/store' && location.search
              ? `/store${location.search}`
              : '/store'
          }
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faStore} style={{ marginRight: 10 }} />
          Store
        </NavLink>

        {!authData && (
          <>
            <NavLink
              className={({ isActive }) => getClassName(isActive)}
              to={
                location.pathname === '/login' && location.search
                  ? `/login${location.search}`
                  : '/login'
              }
              onClick={handleClose}
            >
              <FontAwesomeIcon
                icon={faRightToBracket}
                style={{ marginRight: 10 }}
              />
              Login
            </NavLink>

            <NavLink
              className={({ isActive }) => getClassName(isActive)}
              to={
                location.pathname === '/register' && location.search
                  ? `/register${location.search}`
                  : '/register'
              }
              onClick={handleClose}
            >
              <FontAwesomeIcon icon={faUserPen} style={{ marginRight: 10 }} />
              Register
            </NavLink>
          </>
        )}

        {authData && (
          <>
            <NavLink
              className={({ isActive }) => getClassName(isActive)}
              to={
                location.pathname === '/profile' && location.search
                  ? `/profile${location.search}`
                  : '/profile'
              }
              onClick={handleClose}
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                style={{ marginRight: 10 }}
              />
              Profile
            </NavLink>

            <NavLink
              className={({ isActive }) => getClassName(isActive)}
              to={
                location.pathname === '/orders' && location.search
                  ? `/orders${location.search}`
                  : '/orders'
              }
              onClick={handleClose}
            >
              <FontAwesomeIcon
                icon={faClipboardCheck}
                style={{ marginRight: 10 }}
              />
              Orders
            </NavLink>
            <button
              className={linkStyle}
              style={{ textAlign: 'left', width: '100%' }}
              onClick={() => {
                setShowMenu(false)
                logOut()
              }}
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                style={{ marginRight: 10 }}
              />
              Log Out
            </button>
          </>
        )}
      </Fragment>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <OffCanvas
      className='dark:border-r-[var(--tw-dark-primary-color)]'
      disableBodyClick={false}
      disableBackdrop={false}
      disableScrollLock={false}
      placement='start'
      value={showMenu}
      onChange={(newValue) => {
        setShowMenu(newValue)
      }}
      style={
        {
          // width: 'auto & height: 'auto' don't work so well. They end
          // up defaulting to maxWidth & maxHeight which are 100vw
          // and 100vh, respectively. Thus, don't use 'auto'
        }
      }
      duration={duration}
    >
      {/* The  OffCanvas does not have a div.offcanvas-body. It doesn't 
        really need one, but we can add it here if we want. */}
      <div
        className='bg-[var(--tw-body-color)] dark:bg-[var(--tw-dark-body-color)]'
        style={{
          flexGrow: 1,
          overflowY: 'auto'
        }}
      >
        {renderControls()}
        {renderAdminLinks()}
        {renderNavLinks()}
      </div>
    </OffCanvas>
  )
}
