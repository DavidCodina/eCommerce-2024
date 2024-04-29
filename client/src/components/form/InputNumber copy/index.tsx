import { forwardRef, useId, useState, useRef, useEffect } from 'react'
import { formatValue, getIsOutOfRange, strIsZeroLike } from './utils'
import { IInputNumber } from './types'

//# Next Steps:
//#
//#   prefix/suffix (Make a backup copy. I have a feeling this will throw a monkey wrench into the works.)
//#   Keyboard accessibility (eventually)
//#   Eventually add support for "Delete".

/* ========================================================================
                              InputNumber
======================================================================== */

export const InputNumber = forwardRef<any, IInputNumber>(
  (
    {
      allowNegative = true,
      allowDecimal = true,
      clampBehavior = 'blur',
      defaultValue = '',
      decimalScale,
      fixedDecimalScale = false, // fixedDecimalScale depends on decimalScale
      thousandSeparator,
      min,
      max,
      className = '',
      disabled = false,
      error,
      formGroupClassName = '',
      formGroupStyle = {},
      formText = '',
      formTextClassName = '',
      formTextStyle = {},
      id,
      label = '',
      labelClassName = '',
      labelRequired = false,
      labelStyle = {},

      size,
      style = {},
      touched,
      onKeyDown,
      onBlur,
      onChange,
      onCut,
      onPaste,

      value,
      ...otherProps
    },
    ref
  ) => {
    /* ======================
            constants 
    ====================== */

    const uuid = useId()
    id = id || uuid

    // Mantine has this thing called a decimalSeparator that allows the consumer to pass in
    // their own custom decimal separator instead of '.'. For now I've hardcoded it internall.
    // The problem with allowing a custom decimalSeparator is that it could interfere with
    // parsing operations (e.g. pareFloat(), etc.).
    const decimalSeparator = '.'

    const minNumberOrUndefined = typeof min === 'string' ? parseFloat(min) : min // number | undefined
    const maxNumberOrUndefined = typeof max === 'string' ? parseFloat(max) : max // number | undefined

    decimalScale =
      typeof decimalScale === 'number' ? Math.abs(decimalScale) : undefined

    /* ======================
          state & refs
    ====================== */

    const onChangeRef = useRef(onChange)

    const internalRef = useRef<HTMLInputElement | null>(null)
    // Used to reset cursor when the value is out of range.
    // Set within onKeyDown, onCut, and onPaste.
    const cursorIndexBeforeChange = useRef<number | null>(null)

    // Set within handleChange.
    const cursorIndexAfterChangeRef = useRef<number | null>(null)

    // Used to allow 'Backspace', ⌘+x, or 'cut' on leading '0'.
    const deleteRef = useRef(false)
    const hasPreviousMinusRef = useRef<boolean>()
    const overDecimalScaleByRef = useRef(0)
    const outOfRangeRef = useRef(false)
    const changeEventRef = useRef<React.ChangeEvent<HTMLInputElement> | null>(
      null
    )

    // The logic here should be very similar to what is done in handleChange().
    const [formattedValue, setFormattedValue] = useState(() => {
      if (typeof defaultValue === 'string') {
        const initialValue = formatValue({
          value: typeof value === 'string' ? value : defaultValue,
          // prevValue,
          allowDecimal,
          allowNegative,
          decimalSeparator,
          thousandSeparator,
          decimalScale,
          fixedDecimalScale,
          internalRef,
          cursorIndexAfterChangeRef,
          deleteRef,
          hasPreviousMinusRef,
          overDecimalScaleByRef
        })

        // When clampBehavior === 'strict' we don't actually want to clamp
        // the value. Instead, return early if the value is out of range.
        // Or in this case, just return '' when initializing.

        const isOutOfRange = getIsOutOfRange({
          max: maxNumberOrUndefined,
          min: minNumberOrUndefined,
          value: initialValue
        })

        if (clampBehavior === 'strict' && isOutOfRange) {
          return ''
        }

        return initialValue
      }

      return ''
    })

    const [unformattedValue, setUnformattedValue] = useState(formattedValue)

    // This is set within handleChange and used within a useEffect.
    // It helps trigger the useEffect after the onChange runs, even
    // if the formattedValue doesn't actually change.
    const [changeCount, setChangeCount] = useState(0)

    /* ======================
          getClassName()
    ====================== */

    const getClassName = () => {
      let classes = 'form-control'

      ///////////////////////////////////////////////////////////////////////////
      //
      // This configuration is important. If there is an error, then
      // ALWAYS implement .is-valid. However, if there is no error then ONLY
      // implement .is-valid if touched is true. This makes it so the component
      // can be used without passing in touched and not have an immediate success green.
      // Note also that the component works best when react-hook-form mode is set to 'onTouched'.
      //
      ///////////////////////////////////////////////////////////////////////////
      if (error) {
        classes = `${classes} is-invalid`
      } else if (!error && touched) {
        classes = `${classes} is-valid`
      }

      if (size === 'sm') {
        classes = `${classes} form-control-sm`
      } else if (size === 'lg') {
        classes = `${classes} form-control-lg`
      }

      if (className) {
        classes = `${classes} ${className}`
      }

      return classes
    }

    /* ======================
            clamp()
    ====================== */

    const clamp = (str: string) => {
      // Gotcha: parseFloat('100,000.00') results in 100!
      // This can be mitigated by stripping non numeric characters in advance.
      let newValue: number | string = str.replace(/[^0-9\-.]/g, '')
      newValue = parseFloat(newValue)

      if (
        typeof minNumberOrUndefined === 'number' &&
        newValue < minNumberOrUndefined
      ) {
        newValue = minNumberOrUndefined.toString()
      } else if (
        typeof maxNumberOrUndefined === 'number' &&
        newValue > maxNumberOrUndefined
      ) {
        newValue = maxNumberOrUndefined.toString()
      }

      if (typeof newValue === 'string') {
        // Be aware that when you parseFloat() it will remove any extra zeros,
        // and other formattting. This means that we have to be careful to add
        // back any prefix, suffix, thousandSeparator, trailing zeros, etc.
        // In practice, this means that we probably will need to reapply many
        // of the formatting features here  as well.
        return newValue
      }

      return str
    }

    /* ======================
          handleChange()
    ====================== */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('handleChange() triggered.')
      changeEventRef.current = e

      const selectionStart = e.target.selectionStart
      if (typeof selectionStart === 'number') {
        cursorIndexAfterChangeRef.current = selectionStart
      }

      const isOutOfRange = getIsOutOfRange({
        max: maxNumberOrUndefined,
        min: minNumberOrUndefined,
        value: e.target.value
      })

      // When clampBehavior === 'strict' we don't actually want to clamp
      // the value. Instead, return early if the value is out of range.
      if (clampBehavior === 'strict' && isOutOfRange) {
        outOfRangeRef.current = true
        setChangeCount((v) => v + 1)
        return
      }

      setFormattedValue((prevValue) => {
        const newValue = formatValue({
          value: e.target.value,
          prevValue,
          allowDecimal,
          allowNegative,
          decimalSeparator,
          thousandSeparator,
          decimalScale,
          fixedDecimalScale,
          internalRef,
          cursorIndexAfterChangeRef,
          deleteRef,
          hasPreviousMinusRef,
          overDecimalScaleByRef
        })

        setUnformattedValue(e.target.value)
        setChangeCount((v) => v + 1)
        return newValue
      })
    }

    /* ======================
    handleDeleteOnKeyDown()
    ====================== */

    const handleDeleteOnKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      // Allows user to delete a leading "0" by disabling the associated formatting function temporarily.
      if (e.key === 'Backspace' || (e.metaKey && e.key === 'x')) {
        deleteRef.current = true
      }

      // Allow 'Backspace' to skip backward over "0"s that occur AFTER
      // decimalSeparator when fixedDecimalScale is true.
      if (
        allowDecimal &&
        typeof decimalScale === 'number' &&
        fixedDecimalScale === true
      ) {
        const target = internalRef.current

        if (target !== null && e.key === 'Backspace') {
          const dotIndex = target.value.indexOf(decimalSeparator)
          const selectionStart = target.selectionStart
          const selectionEnd = target.selectionEnd

          if (
            dotIndex !== -1 &&
            selectionStart !== null &&
            selectionEnd !== null &&
            // Only call e.preventDefault() on the 'Backspace' when the cursor is before the decimalSeparator.
            selectionStart > dotIndex
          ) {
            // What actually happens in Mantine is the user is allowed to backspace
            // on a fixed decimal, and it will get convert that decimal place to "0".
            // However, if it's already "0", then just move the cursor back by one position.
            const isSingleSelection =
              typeof selectionStart === 'number' &&
              typeof selectionEnd === 'number' &&
              selectionStart === selectionEnd

            if (isSingleSelection) {
              const charToDeleteOrSkip = target.value[selectionStart - 1]
              e.preventDefault()

              // If the character is not '0' or decimalSeparator then replace it with '0'.
              if (
                charToDeleteOrSkip !== '0' &&
                charToDeleteOrSkip !== decimalSeparator
              ) {
                const before = target.value.slice(0, selectionStart - 1)
                const after = target.value.slice(selectionStart)
                const newValue = `${before}0${after}`
                target.value = newValue
              }

              target.selectionStart = selectionStart - 1
              target.selectionEnd = selectionStart - 1
            }
            // There shouldn't be a need to run custom logic when isMultiSelection.
            // In that case, just let the default behavior do its thing.
          }
        }
      }
    }

    /* ======================
    handleDecimalSeparatorOnKeyDown()
    ====================== */

    const handleDecimalSeparatorOnKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      const target = internalRef.current

      if (target && e.key === decimalSeparator) {
        const decimalSeparatorIndex = target.value.indexOf(decimalSeparator)
        const selectionStart = target.selectionStart

        // If there is already a decimalSeparator or if !allowDecimal,
        // then simply call   e.preventDefault()
        if (target.value.includes(decimalSeparator) || !allowDecimal) {
          e.preventDefault()
        }

        // If there is a decimalSeparator and the cursor index is on it, then skip over it.
        if (
          decimalSeparatorIndex !== -1 &&
          typeof selectionStart === 'number' &&
          selectionStart === decimalSeparatorIndex
        ) {
          target.selectionStart = selectionStart + 1
          target.selectionEnd = selectionStart + 1
        }
      }
    }

    /* ======================
      handleMinusOnKeyDown()
    ====================== */

    const handleMinusOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === '-') {
        if (!allowNegative) {
          e.preventDefault()
        } else {
          // IMMEDIATELY update hasMinusRef based on whether formattedValue has
          // a "-". This must happen with a ref, so it's available BEFORE the onChange
          // runs. Ultimately we want the "-" key to function like a toggle. This ref
          // helps the onChange handler determine how to treat "-" characters.
          hasPreviousMinusRef.current = formattedValue.includes('-')
        }
      }
    }

    /* ======================
    handleThousandSeparatorOnKeyDown()
    ====================== */

    const handleThousandSeparatorOnKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      const target = internalRef.current

      if (target !== null) {
        const selectionStart = target.selectionStart

        if (typeof selectionStart === 'number') {
          // 1. thousandSeparator : skip forard.
          if (e.key === thousandSeparator) {
            if (target.value[selectionStart] === thousandSeparator) {
              e.preventDefault()
              target.selectionStart = selectionStart + 1
              target.selectionEnd = selectionStart + 1
            }
          }

          // 2. 'Backspace' : skip back
          if (e.key === 'Backspace') {
            if (target.value[selectionStart - 1] === thousandSeparator) {
              e.preventDefault()
              target.selectionStart = selectionStart - 1
              target.selectionEnd = selectionStart - 1
            }
          }
        }
      }
    }

    /* ======================
          useEffect()
    ====================== */
    ///////////////////////////////////////////////////////////////////////////
    //
    // Two-way binding:
    //
    // Whenever formattedValue updates, call onChangeRef.current?.(changeEventRef.current).
    // This allows for an optional controlled component implementation.
    //
    // This useEffect() implementation ensures that the logic is also called onBlur.
    // Why? Because onBlur also calls setFormattedValue(), and just in case
    // formattedValue remains unchanged, it also calls setChangeCount().
    //
    // The way this works is as follows:
    //
    //   1. The <input> detects a change and triggers handleChange.
    //
    //   2. Once handleChange() runs and formattedValue is updated, this
    //      then runs and passes the event back to the consumer.
    //
    //   3. The consumer can then pick out e.target.value, which is essentially,
    //      the newest formattedValue and do what they want with it. In a controlled
    //      implementation one would use e.target.value to update a setValue() setter,
    //      and value={value} would be piped back into the component.
    //
    // Initially, I had a Two-way binding part 2, but I actually think it's redundant.
    //
    ///////////////////////////////////////////////////////////////////////////

    useEffect(() => {
      if (changeEventRef.current) {
        onChangeRef.current?.(changeEventRef.current)
      }
    }, [formattedValue]) //! changeCount :  Do we really need changeCount as a dependency.

    /* ======================
          useEffect()
    ====================== */
    // This useEffect has one responsibility: call calculateCursorPosition()
    // when formattedValue and/or changeCount updates.
    // useLayoutEffect ???

    useEffect(() => {
      const calculateCursorPosition = () => {
        if (
          !internalRef.current ||
          typeof cursorIndexAfterChangeRef.current !== 'number'
        ) {
          return
        }

        if (
          outOfRangeRef.current === true &&
          typeof cursorIndexBeforeChange.current === 'number'
        ) {
          internalRef.current.setSelectionRange(
            cursorIndexBeforeChange.current,
            cursorIndexBeforeChange.current
          )
          // Reset refs
          outOfRangeRef.current = false
          cursorIndexAfterChangeRef.current = null
          return
        }

        // Suppose you have '1234' and the cursor is in the middle.
        // Then you press '-'. It will add the cursor to the beginning
        // of the string based on the "-" logic defined elsewhere, but
        // the cursor will end up jumping to the end of the string.
        // This fixes that case.
        if (unformattedValue.length === formattedValue.length) {
          //! console.log('Cursor Case 1')
          internalRef.current.setSelectionRange(
            cursorIndexAfterChangeRef.current,
            cursorIndexAfterChangeRef.current
          )
        }

        if (unformattedValue.length > formattedValue.length) {
          //! console.log('Cursor Case 2')
          const diff = unformattedValue.length - formattedValue.length
          // setSelectionRange() is supported in most modern browsers, but check for compatibility if targeting older browsers.
          // The method might not work consistently in certain input types or mobile browsers.

          internalRef.current.setSelectionRange(
            // overDecimalScaleByRef.current is set withinn formatDecimalScale()
            cursorIndexAfterChangeRef.current -
              diff +
              overDecimalScaleByRef.current,
            cursorIndexAfterChangeRef.current -
              diff +
              overDecimalScaleByRef.current
          )
        }

        // Suppose we had '1234' and the cursor is at the very beginning.
        // Then you press the decimalSeparator key (e.g, ".").
        // It will change the string to '0.1234' based on the logic
        // for prepending "0" defined elsewhere, but the cursor will end
        // up jumping to the end of the string. This fixes that case.
        // For example: '.1234' < '0.1234'
        if (unformattedValue.length < formattedValue.length) {
          //! console.log('Cursor Case 3', { unformattedValue, formattedValue })

          const diff = formattedValue.length - unformattedValue.length

          // In cases where the following conditions are true, prevent the diff from being added.
          // Thus if we type a single character, the cursor wil not jump to the end.
          let fixedDecimalScaleDiff = 0
          if (
            unformattedValue.length === 1 &&
            allowDecimal &&
            typeof decimalScale === 'number' &&
            fixedDecimalScale === true
          ) {
            fixedDecimalScaleDiff = diff
          }

          internalRef.current.setSelectionRange(
            cursorIndexAfterChangeRef.current + diff - fixedDecimalScaleDiff,
            cursorIndexAfterChangeRef.current + diff - fixedDecimalScaleDiff
          )
        }

        // Reset ref.
        cursorIndexAfterChangeRef.current = null
      }

      calculateCursorPosition()
    }, [
      formattedValue,
      unformattedValue,
      changeCount,
      allowDecimal,
      decimalScale,
      fixedDecimalScale
    ])

    /* ======================
          useEffect()
    ====================== */

    useEffect(() => {
      deleteRef.current = false
    }, [formattedValue])

    /* ======================
          renderLabel()
    ====================== */

    const renderLabel = () => {
      if (label) {
        return (
          <label
            htmlFor={id}
            className={`form-label${
              labelClassName ? ` ${labelClassName}` : ''
            }`}
            style={{
              ...labelStyle,
              ...(disabled ? { color: 'var(--form-disabled-color)' } : {})
            }}
          >
            {label}{' '}
            {labelRequired && (
              <sup
                className=''
                style={{
                  color: disabled ? 'inherit' : 'red'
                }}
              >
                *
              </sup>
            )}
          </label>
        )
      }
      return null
    }

    /* ======================
        renderFormText()
    ====================== */

    const renderFormText = () => {
      if (formText) {
        return (
          <div
            className={`form-text${
              formTextClassName ? ` ${formTextClassName}` : ''
            }`}
            style={formTextStyle}
          >
            {formText}
          </div>
        )
      }

      return null
    }

    /* ======================
          renderError()
    ====================== */

    const renderError = () => {
      if (error) {
        return <div className={`invalid-feedback`}>{error}</div>
      }
      return null
    }

    /* ======================
            return
    ====================== */

    return (
      <div className={formGroupClassName} style={formGroupStyle}>
        {renderLabel()}

        <input
          autoComplete='off'
          className={getClassName()}
          disabled={disabled}
          id={id}
          ref={(node) => {
            // We can't know in advance whether ref will be a function or an object literal.
            // For that reason, we need to use the following conditional logic.
            // https://stackoverflow.com/questions/71495923/how-to-use-the-ref-with-the-react-hook-form-react-library
            if (ref && 'current' in ref) {
              ref.current = node
            } else if (typeof ref === 'function') {
              ref?.(node)
            }
            internalRef.current = node
          }}
          spellCheck={false}
          style={style}
          {...otherProps}
          //# Because this is type="text", we need to make sure that when we implement
          //# the controls that they are also keyboard accessible.
          type='text'
          onCut={(e) => {
            deleteRef.current = true
            if (internalRef.current !== null) {
              cursorIndexBeforeChange.current =
                internalRef.current.selectionStart
            }
            onCut?.(e)
          }}
          onPaste={(e) => {
            if (internalRef.current !== null) {
              cursorIndexBeforeChange.current =
                internalRef.current.selectionStart
            }
            onPaste?.(e)
          }}
          // //# Gotcha: Just in case there is also a 'Delete' event we need to check for that in all places as well.
          // //# e.key === "Backspace" || e.key === "Delete" ( ensure compatibility across systems).
          // //# However, this isn't entirely correct. "Delete" deletes in the other direction, so we'd need
          // //# to create entirely separate logic for that. See if Mantine works with it.
          // //#
          // //#  macOS has a separate "Fn + Delete" shortcut to delete characters
          // //# to the right of the cursor, similar to the "Delete" key on Windows.
          // //#
          // //#   Windows: No key directly produces "Delete" in event.key. The key labeled "Delete" on Windows keyboards typically generates an event.key value of "Backspace".
          // //#
          // //#   Mac: "Fn + Delete" combination: This specific shortcut, which deletes characters to the right of the cursor, results in an event.key value of "Delete".

          // //# Mantine does support "Delete" without making the cursor jump to the very end.

          onKeyDown={(e) => {
            if (internalRef.current !== null) {
              cursorIndexBeforeChange.current =
                internalRef.current.selectionStart
            }

            handleDeleteOnKeyDown(e)
            handleDecimalSeparatorOnKeyDown(e)
            handleMinusOnKeyDown(e)
            handleThousandSeparatorOnKeyDown(e)
            onKeyDown?.(e)
          }}
          onChange={handleChange}
          onBlur={(e) => {
            const isOutOfRange = getIsOutOfRange({
              max: maxNumberOrUndefined,
              min: minNumberOrUndefined,
              value: e.target.value
            })

            setFormattedValue((prevValue) => {
              let newValue = formatValue({
                value:
                  isOutOfRange && clampBehavior === 'blur'
                    ? clamp(e.target.value)
                    : e.target.value,
                prevValue,
                allowDecimal,
                allowNegative,
                decimalSeparator,
                thousandSeparator,
                decimalScale,
                fixedDecimalScale,
                internalRef,
                cursorIndexAfterChangeRef,
                deleteRef,
                hasPreviousMinusRef,
                overDecimalScaleByRef
              })

              // Remove trailing "."
              if (newValue.endsWith(decimalSeparator)) {
                newValue = newValue.slice(0, -1)
              }
              // Remove solo "-" / "."
              if (newValue === '-' || newValue === decimalSeparator) {
                newValue = ''
              }

              // Convert "-0" to just "0".
              if (strIsZeroLike(newValue)) {
                newValue = newValue.replace(/-/g, '')
              }

              //# Maybe do something here if the value is ONLY prefix/suffix.
              //# But it looks like it may not be necessary.

              if (newValue) setUnformattedValue(e.target.value)
              setChangeCount((v) => v + 1)
              return newValue
            })

            onBlur?.(e)
            // There's no need to call onChange?.(e) Because setFormattedValue's
            // internal logic calls setChangeCount((v) => v + 1), this will trigger
            // the useEffect() that handles the two-way binding part 2.
          }}
          value={formattedValue}
        />
        {renderFormText()}
        {renderError()}
      </div>
    )
  }
)

InputNumber.displayName = 'InputNumber'
