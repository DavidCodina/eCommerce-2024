import { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

export interface ILinkPreload extends ComponentProps<typeof Link> {
  preload?: boolean
  showLogs?: boolean
}

export type Route = Record<string, any>
export type MaybeRoute = Record<string, any> | null | undefined
