import {
  useState,
  PropsWithChildren,
  createContext,
  useContext,
  SetStateAction,
  Dispatch
} from 'react'

import { useThrottle } from 'hooks'

export interface AppContextValue {
  setShowMenu: Dispatch<SetStateAction<boolean>>
  showMenu: boolean
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  userStatus: 'idle' | 'pending' | 'success' | 'error'
  setUserStatus: Dispatch<
    SetStateAction<'idle' | 'pending' | 'success' | 'error'>
  >
  // [key: string]: any
}

const throttleDuration = 200

/* ========================================================================

======================================================================== */

export const AppContext = createContext({} as AppContextValue)
export const AppConsumer = AppContext.Consumer

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [_showMenu, setShowMenu] = useState(false)
  const showMenu = useThrottle(_showMenu, throttleDuration) as boolean

  // For this application, user is being treated as critical data.
  // This means that it's requested immediately on mount when authData exists.
  const [user, setUser] = useState<User | null>(null)
  const [userStatus, setUserStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  /* ======================
          return
  ====================== */

  return (
    <AppContext.Provider
      value={{
        showMenu,
        setShowMenu,
        user,
        setUser,
        userStatus,
        setUserStatus
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const value = useContext(AppContext)
  return value
}
