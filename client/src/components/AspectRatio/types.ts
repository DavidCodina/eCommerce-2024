import { CSSProperties, ReactNode } from 'react'

export type AlertColorDictonary = Omit<
  ColorDictionary,
  'inherit' | 'current' | 'transparent' | 'black' | 'white'
>

export type AlertColor = keyof AlertColorDictonary

export interface IAlert {
  color?: AlertColor
  className?: string
  children?: ReactNode
  style?: CSSProperties
}

export interface IAlertHeading {
  className?: string
  children?: ReactNode
  style?: CSSProperties
}
export interface IAlertBody {
  className?: string
  children?: ReactNode
  style?: CSSProperties
}
export interface IAlertText {
  className?: string
  children?: ReactNode
  style?: CSSProperties
}
