import { ReactNode } from 'react'

type StoreNavProps = {
  children?: ReactNode
}

/* ========================================================================
                              StoreNav   
======================================================================== */

export const StoreNav = ({ children }: StoreNavProps) => {
  return (
    <nav
      className='fixed left-0 top-0  w-full items-center bg-blue-500 px-6 py-2'
      style={{ zIndex: 1 }}
    >
      <div className='mx-auto flex gap-6 2xl:container'>{children}</div>
    </nav>
  )
}
