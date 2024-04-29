import { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react'

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  leftSection?: ReactNode
  rightSection?: ReactNode
  loading?: boolean
  loadingStyle?: CSSProperties
  loadingClassName?: string
  loader?: ReactNode
  /** In NextUI isIconOnly controls whether the button should have the same width and height.
   * Here, that practice is extended to also control how the loader is rendered.
   */
  isIconOnly?: boolean
}

export type ButtonRef = HTMLButtonElement
