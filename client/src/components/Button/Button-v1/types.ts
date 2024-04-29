// Third-party imports
import React, {
  CSSProperties,
  ComponentPropsWithRef,
  ElementType,
  ReactNode
} from 'react'

type ButtonSize =
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl'

type ButtonColors = Omit<ColorDictionary, 'inherit' | 'current' | 'transparent'>

type ButtonColor = keyof ButtonColors

///////////////////////////////////////////////////////////////////////////
//
// https://levelup.gitconnected.com/create-more-extensible-react-components-with-the-as-prop-pattern-b79bcbcf4024
// https://stevekinney.github.io/react-and-typescript/polymorphic-components
//
// Initially, the Polymorphic setup looked like this:
//
//   type ButtonOwnProps<T extends React.ElementType = React.ElementType> = {
//     as?: T
//     ...
//   }
//
//   type ButtonProps<U extends React.ElementType> = ButtonOwnProps<U> & Omit<React.ComponentProps<U>, keyof ButtonOwnProps>
//
//   const defaultElement = 'button'
//
//   export function Button<E extends React.ElementType = typeof defaultElement>(props: ButtonProps<E>): React.ReactElement | null {
//     ...
//   }
//
// But then when we go to wrap it in forwardRef, things get a whole lot more nuts!
// Most of what I did here is based off of this article:
// https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/
//
//
///////////////////////////////////////////////////////////////////////////

type AsProp<C extends ElementType> = {
  as?: C
}

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P)

export type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithRef<C>['ref']

type PolymorphicComponentProp<
  C extends ElementType,
  Props = object //! {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

type PolymorphicComponentPropWithRef<
  C extends ElementType,
  Props = object //! {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> }

export type ButtonProps<C extends ElementType> =
  PolymorphicComponentPropWithRef<
    C,
    {
      children: ReactNode
      className?: string
      color: ButtonColor
      loading?: boolean
      onClick?: () => void
      pill?: boolean
      size?: ButtonSize
      style?: CSSProperties
      variant?: 'outline'
    }
  >

///////////////////////////////////////////////////////////////////////////
//
// Note: The last part of the LogRocket tutorial adds type ButtonComponent (TextComponent)
// such that the return type is ReactElement | null. However, when I try to tack this on to
// the Button component it complains.
//
//   export const Button: ButtonComponent = ...
//
// This can be demonstrated as follows:
//
//   type MyComponent = (props: any) => ReactElement | null
//
//   export const ButtonX: MyComponent = forwardRef<any, any>((props, ref) => {
//     return null
//   })
//
// We end up getting the following errors:
//
//   Type 'ForwardRefExoticComponent<Omit<ButtonProps<ElementType>, "ref"> & RefAttributes<unknown>>'
//   is not assignable to type 'ButtonComponent'.
//
//   Type 'ReactNode' is not assignable to type 'ReactElement<any, string | JSXElementConstructor<any>> | null'.
//
//   Type 'undefined' is not assignable to type 'ReactElement<any, string | JSXElementConstructor<any>> | null'.
//
// It seems like wrapping the component in forwardRef makes it so that it may
// return undefined and this clashes with the ButtonComponent definition.
// I couldn't get a clear explanation of the problem through reading various
// blogs, but the simple explanation seems to be to change the return type
// to ReactNode.
//
///////////////////////////////////////////////////////////////////////////

export type ButtonComponent = <C extends ElementType = typeof defaultElement>(
  props: ButtonProps<C>
) => ReactNode //^ ReactElement | null

export const defaultElement = 'button'
