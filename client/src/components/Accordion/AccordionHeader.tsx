import { ComponentProps } from 'react'
import { twMerge } from 'tailwind.config'

/* ========================================================================
                            AccordionHeader
======================================================================== */

interface IAccordionHeader extends ComponentProps<'h3'> {}

export const AccordionHeader = ({
  children,
  className = '',
  style = {}
}: IAccordionHeader) => {
  const headerClassName =
    'm-0 flex text-base font-bold leading-none text-blue-500'
  return (
    <h3 className={twMerge(headerClassName, className)} style={style}>
      {children}
    </h3>
  )
}
