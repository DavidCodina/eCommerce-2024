import plugin from 'tailwindcss/plugin'

/* ========================================================================
                              formPlugin
======================================================================== */

export const formPlugin = plugin(function (pluginApi) {
  const { addComponents /*, theme */ } = pluginApi

  addComponents({
    ':root': {
      '--bs-success': '#198754',
      '--bs-danger': '#dc3545',
      '--bs-success-rgb': '25, 135, 84',
      '--bs-danger-rgb': '220, 53, 69',
      '--bs-body-color': '#212529',
      '--bs-body-color-rgb': '33, 37, 41',
      '--bs-body-bg': '#fff',
      '--bs-secondary-color': 'rgba(33, 37, 41, 0.75)',
      '--bs-secondary-bg': '#e9ecef',
      '--bs-tertiary-bg': '#f8f9fa',
      '--bs-border-width': '1px',
      '--bs-border-color': '#dee2e6',
      '--bs-border-radius': '0.375rem',
      '--bs-border-radius-sm': '0.25rem',
      '--bs-border-radius-lg': '0.5rem',
      '--bs-form-valid-color': '#198754',
      '--bs-form-valid-border-color': '#198754',
      '--bs-form-invalid-color': '#dc3545',
      '--bs-form-invalid-border-color': '#dc3545'
    },

    /* ======================
          .form-label
    ====================== */

    '.form-label': {
      marginBottom: '0.5rem'
    },

    /* ======================
        .col-form-label
    ====================== */

    '.col-form-label': {
      paddingTop: 'calc(0.375rem + var(--bs-border-width))',
      paddingBottom: 'calc(0.375rem + var(--bs-border-width))',
      marginBottom: '0',
      fontSize: 'inherit',
      lineHeight: '1.5'
    },

    '.col-form-label-lg': {
      paddingTop: 'calc(0.5rem + var(--bs-border-width))',
      paddingBottom: 'calc(0.5rem + var(--bs-border-width))',
      fontSize: '1.25rem'
    },

    '.col-form-label-sm': {
      paddingTop: 'calc(0.25rem + var(--bs-border-width))',
      paddingBottom: 'calc(0.25rem + var(--bs-border-width))',
      fontSize: '0.875rem'
    },

    /* ======================
          .form-text
    ====================== */

    '.form-text': {
      marginTop: '0.25rem',
      fontSize: '0.875em',
      color: 'var(--bs-secondary-color)'
    },

    /* ======================
          .form-control
    ====================== */

    '.form-control': {
      display: 'block',
      width: '100%',
      padding: '0.375rem 0.75rem',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: 'var(--bs-body-color)',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none',
      backgroundColor: 'var(--bs-body-bg)',
      backgroundClip: 'padding-box',
      border: 'var(--bs-border-width) solid var(--bs-border-color)',
      borderRadius: 'var(--bs-border-radius)',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
    },

    // @media (prefers-reduced-motion: reduce) {
    //   .form-control {
    //     transition: none;
    //   }
    // }

    '.form-control[type=file]': {
      overflow: 'hidden'
    },

    '.form-control[type=file]:not(:disabled):not([readonly])': {
      cursor: 'pointer'
    },

    '.form-control:focus': {
      color: 'var(--bs-body-color)',
      backgroundColor: 'var(--bs-body-bg)',
      borderColor: '#86b7fe',
      outline: '0',
      boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
    },

    '.form-control::-webkit-date-and-time-value': {
      minWidth: '85px',
      height: '1.5em',
      margin: '0px'
    },

    '.form-control::-webkit-datetime-edit': {
      display: 'block',
      padding: '0px'
    },

    '.form-control::-moz-placeholder': {
      color: 'var(--bs-secondary-color)',
      opacity: '1'
    },

    '.form-control::placeholder': {
      color: 'var(--bs-secondary-color)',
      opacity: '1'
    },

    '.form-control:disabled': {
      backgroundColor: 'var(--bs-secondary-bg)',
      opacity: '1'
    },

    '.form-control::-webkit-file-upload-button': {
      padding: '0.375rem 0.75rem',
      margin: '-0.375rem -0.75rem',
      '-webkit-margin-end': '0.75rem',
      'margin-inline-end': '0.75rem',
      color: 'green', //'var(--bs-body-color)',
      backgroundVolor: 'var(--bs-tertiary-bg)',
      pointerEvents: 'none',
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0px',
      'border-inline-end-width': 'var(--bs-border-width)',
      borderRadius: '0px',
      '-webkit-transition':
        'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      transition:
        'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
    },

    '.form-control::file-selector-button': {
      padding: '0.375rem 0.75rem',
      margin: '-0.375rem -0.75rem',
      '-webkit-margin-end': '0.75rem',
      'margin-inline-end': '0.75rem',
      color: 'var(--bs-body-color)',
      backgroundColor: 'var(--bs-tertiary-bg)',
      pointerEvents: 'none',
      borderColor: 'inherit',
      borderStyle: 'solid',
      borderWidth: '0px',
      'border-inline-end-width': 'var(--bs-border-width)',
      borderRadius: '0px',
      transition:
        'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
    },

    // @media (prefers-reduced-motion: reduce) {
    //   .form-control::-webkit-file-upload-button {
    //     -webkit-transition: none;
    //     transition: none;
    //   }
    //   .form-control::file-selector-button {
    //     transition: none;
    //   }
    // }

    '.form-control:hover:not(:disabled):not([readonly])::-webkit-file-upload-button':
      {
        backgroundColor: 'var(--bs-secondary-bg)'
      },

    '.form-control:hover:not(:disabled):not([readonly])::file-selector-button':
      {
        backgroundColor: 'var(--bs-secondary-bg)'
      },

    /* ======================
      .form-control-plaintext
    ====================== */

    '.form-control-plaintext': {
      display: 'block',
      width: '100%',
      padding: '0.375rem 0',
      marginBottom: '0',
      lineHeight: '1.5',
      color: 'var(--bs-body-color)',
      backgroundColor: 'transparent',
      border: 'solid transparent',
      borderWidth: 'var(--bs-border-width) 0'
    },

    '.form-control-plaintext:focus': {
      outline: '0'
    },

    '.form-control-plaintext.form-control-sm, .form-control-plaintext.form-control-lg':
      {
        paddingRight: '0',
        paddingLeft: '0'
      },

    /* ======================
        .form-control-sm
    ====================== */

    '.form-control-sm': {
      minHeight: 'calc(1.5em + 0.5rem + calc(var(--bs-border-width) * 2))',
      padding: '0.25rem 0.5rem',
      fontSize: '0.875rem',
      borderRadius: 'var(--bs-border-radius-sm)'
    },

    '.form-control-sm::-webkit-file-upload-button': {
      padding: '0.25rem 0.5rem',
      margin: '-0.25rem -0.5rem',
      '-webkit-margin-end': '0.5rem',
      'margin-inline-end': '0.5rem'
    },

    '.form-control-sm::file-selector-button': {
      padding: '0.25rem 0.5rem',
      margin: '-0.25rem -0.5rem',
      '-webkit-margin-end': '0.5rem',
      'margin-inline-end': '0.5rem'
    },

    /* ======================
        .form-control-lg
    ====================== */

    '.form-control-lg': {
      minHeight: 'calc(1.5em + 1rem + calc(var(--bs-border-width) * 2))',
      padding: '0.5rem 1rem',
      fontSize: '1.25rem',
      borderRadius: 'var(--bs-border-radius-lg)'
    },

    '.form-control-lg::-webkit-file-upload-button': {
      padding: '0.5rem 1rem',
      margin: '-0.5rem -1rem',
      '-webkit-margin-end': '1rem',
      'margin-inline-end': '1rem'
    },

    '.form-control-lg::file-selector-button': {
      padding: '0.5rem 1rem',
      margin: '-0.5rem -1rem',
      '-webkit-margin-end': '1rem',
      'margin-inline-end': '1rem'
    },

    /* ======================
            textarea
    ====================== */

    'textarea.form-control': {
      minHeight: 'calc(1.5em + 0.75rem + calc(var(--bs-border-width) * 2))'
    },

    'textarea.form-control-sm': {
      minHeight: 'calc(1.5em + 0.5rem + calc(var(--bs-border-width) * 2))'
    },

    'textarea.form-control-lg': {
      minHeight: 'calc(1.5em + 1rem + calc(var(--bs-border-width) * 2))'
    },

    /* ======================
       .form-control-color
    ====================== */

    '.form-control-color': {
      width: '3rem',
      height: 'calc(1.5em + 0.75rem + calc(var(--bs-border-width) * 2))',
      padding: '0.375rem'
    },

    '.form-control-color:not(:disabled):not([readonly])': {
      cursor: 'pointer'
    },

    '.form-control-color::-moz-color-swatch': {
      border: '0 !important',
      borderRadius: 'var(--bs-border-radius)'
    },

    '.form-control-color::-webkit-color-swatch': {
      border: '0 !important',
      borderRadius: 'var(--bs-border-radius)'
    },

    '.form-control-color.form-control-sm': {
      height: 'calc(1.5em + 0.5rem + calc(var(--bs-border-width) * 2))'
    },

    '.form-control-color.form-control-lg': {
      height: 'calc(1.5em + 1rem + calc(var(--bs-border-width) * 2))'
    },

    /* ======================
          .form-select
    ====================== */

    '.form-select': {
      '--bs-form-select-bg-img': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
      display: 'block',
      width: '100%',
      padding: '0.375rem 2.25rem 0.375rem 0.75rem',
      '-moz-padding-start': 'calc(0.75rem - 3px)',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: 'var(--bs-body-color)',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none',
      backgroundColor: 'var(--bs-body-bg)',
      //# Test that this works
      backgroundImage: `var(--bs-form-select-bg-img), var(--bs-form-select-bg-icon, none)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.75rem center',
      backgroundSize: '16px 12px',
      border: 'var(--bs-border-width) solid var(--bs-border-color)',
      borderRadius: 'var(--bs-border-radius)',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
    },

    // @media (prefers-reduced-motion: reduce) {
    //   .form-select {
    //     transition: none;
    //   }
    // }

    '.form-select:focus': {
      borderColor: '#86b7fe',
      outline: '0',
      boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
    },

    ".form-select[multiple], .form-select[size]:not([size='1'])": {
      paddingRight: '0.75rem',
      backgroundImage: 'none'
    },

    '.form-select:disabled': {
      backgroundColor: 'var(--bs-secondary-bg)'
    },

    '.form-select:-moz-focusring': {
      color: 'transparent',
      textShadow: '0 0 0 var(--bs-body-color)'
    },

    '.form-select-sm': {
      paddingTop: '0.25rem',
      paddingBottom: '0.25rem',
      paddingLeft: '0.5rem',
      fontSize: '0.875rem',
      borderRadius: 'var(--bs-border-radius-sm)'
    },

    '.form-select-lg': {
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      paddingLeft: '1rem',
      fontSize: '1.25rem',
      borderRadius: 'var(--bs-border-radius-lg)'
    },

    // '[data-bs-theme=dark] .form-select': {
    //   '--bs-form-select-bg-img': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23dee2e6' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`
    // },

    /* ======================
          .form-check 
    ====================== */

    // Wraps <input> & <label>
    '.form-check': {
      display: 'block',
      minHeight: '1.5rem',
      paddingLeft: '1.5em',
      marginBottom: '0.125rem'
    },

    '.form-check .form-check-input': {
      float: 'left',
      marginLeft: '-1.5em'
    },

    '.form-check-reverse': {
      paddingRight: '1.5em',
      paddingLeft: '0',
      textAlign: 'right'
    },

    '.form-check-reverse .form-check-input': {
      float: 'right',
      marginRight: '-1.5em',
      marginLeft: '0'
    },

    '.form-check-input': {
      '--bs-form-check-bg': 'var(--bs-body-bg)',
      flexShrink: '0',
      width: '1em',
      height: '1em',
      marginTop: '0.25em',
      verticalAlign: 'top',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none',
      backgroundColor: 'var(--bs-form-check-bg)',
      backgroundImage: 'var(--bs-form-check-bg-image)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      border: 'var(--bs-border-width) solid var(--bs-border-color)',
      '-webkit-print-color-adjust': 'exact',
      colorAdjust: 'exact',
      'print-color-adjust': 'exact'
    },

    '.form-check-input[type=checkbox]': {
      borderRadius: '0.25em'
    },

    '.form-check-input[type=radio]': {
      borderRadius: '50%'
    },

    '.form-check-input:active': {
      filter: 'brightness(90%)'
    },

    '.form-check-input:focus': {
      borderColor: '#86b7fe',
      outline: '0',
      boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
    },

    '.form-check-input:checked': {
      backgroundColor: '#0d6efd',
      borderColor: '#0d6efd'
    },

    '.form-check-input:checked[type=checkbox]': {
      '--bs-form-check-bg-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e")`
    },

    '.form-check-input:checked[type=radio]': {
      '--bs-form-check-bg-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='%23fff'/%3e%3c/svg%3e")`
    },

    '.form-check-input[type=checkbox]:indeterminate': {
      backgroundColor: '#0d6efd',
      borderColor: '#0d6efd',
      '--bs-form-check-bg-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10h8'/%3e%3c/svg%3e")`
    },

    '.form-check-input:disabled': {
      pointerEvents: 'none',
      filter: 'none',
      opacity: '0.5'
    },

    '.form-check-input[disabled] ~ .form-check-label, .form-check-input:disabled ~ .form-check-label':
      {
        cursor: 'default',
        opacity: '0.5'
      },

    /* ======================
          .form-switch
    ====================== */

    '.form-switch': {
      paddingLeft: '2.5em'
    },

    '.form-switch .form-check-input': {
      '--bs-form-switch-bg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%280, 0, 0, 0.25%29'/%3e%3c/svg%3e")`,
      width: '2em',
      marginLeft: '-2.5em',
      backgroundImage: 'var(--bs-form-switch-bg)',
      backgroundPosition: 'left center',
      borderRadius: '2em',
      transition: 'background-position 0.15s ease-in-out'
    },

    // @media (prefers-reduced-motion: reduce) {
    //   .form-switch .form-check-input {
    //     transition: none;
    //   }
    // }

    '.form-switch .form-check-input:focus': {
      '--bs-form-switch-bg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%2386b7fe'/%3e%3c/svg%3e")`
    },

    '.form-switch .form-check-input:checked': {
      backgroundPosition: 'right center',
      '--bs-form-switch-bg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e")`
    },

    '.form-switch.form-check-reverse': {
      paddingRight: '2.5em',
      paddingLeft: '0'
    },

    '.form-switch.form-check-reverse .form-check-input': {
      marginRight: '-2.5em',
      marginLeft: '0'
    },

    /* ======================
        .form-check-inline
    ====================== */

    '.form-check-inline': {
      display: 'inline-block',
      marginRight: '1rem'
    },

    /* ======================
          .btn-check
    ====================== */

    '.btn-check': {
      position: 'absolute',
      clip: 'rect(0, 0, 0, 0)',
      pointerEvents: 'none'
    },

    '.btn-check[disabled] + .btn, .btn-check:disabled + .btn': {
      pointerEvents: 'none',
      filter: 'none',
      opacity: '0.65'
    },

    // '[data-bs-theme=dark] .form-switch .form-check-input:not(:checked):not(:focus)':
    //   {
    //     '--bs-form-switch-bg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%28255, 255, 255, 0.25%29'/%3e%3c/svg%3e")`
    //   },

    /* ======================
          .form-range
    ====================== */

    '.form-range': {
      width: '100%',
      height: '1.5rem',
      padding: '0',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none',
      backgroundColor: 'transparent'
    },

    '.form-range:focus': {
      outline: '0'
    },

    '.form-range:focus::-webkit-slider-thumb': {
      boxShadow: '0 0 0 1px #fff, 0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
    },

    '.form-range:focus::-moz-range-thumb': {
      boxShadow: '0 0 0 1px #fff, 0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
    },

    '.form-range::-moz-focus-outer': {
      border: '0'
    },

    '.form-range::-webkit-slider-thumb': {
      width: '1rem',
      height: '1rem',
      marginTop: '-0.25rem',
      '-webkit-appearance': 'none',
      appearance: 'none',
      backgroundColor: '#0d6efd',
      border: '0',
      borderRadius: '1rem',
      '-webkit-transition':
        'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      transition:
        'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
    },

    // @media (prefers-reduced-motion: reduce) {
    //   .form-range::-webkit-slider-thumb {
    //     -webkit-transition: none;
    //     transition: none;
    //   }
    // }

    '.form-range::-webkit-slider-thumb:active': {
      backgroundColor: '#b6d4fe'
    },

    '.form-range::-webkit-slider-runnable-track': {
      width: '100%',
      height: '0.5rem',
      color: 'transparent',
      cursor: 'pointer',
      backgroundColor: 'var(--bs-secondary-bg)',
      borderColor: 'transparent',
      borderRadius: '1rem'
    },

    '.form-range::-moz-range-thumb': {
      width: '1rem',
      height: '1rem',
      '-moz-appearance': 'none',
      appearance: 'none',
      backgroundColor: '#0d6efd',
      border: '0',
      borderRadius: '1rem',
      '-moz-transition':
        'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      transition:
        'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
    },

    // @media (prefers-reduced-motion: reduce) {
    //   .form-range::-moz-range-thumb {
    //     -moz-transition: none;
    //     transition: none;
    //   }
    // }

    '.form-range::-moz-range-thumb:active': {
      backgroundColor: '#b6d4fe'
    },

    '.form-range::-moz-range-track': {
      width: '100%',
      height: '0.5rem',
      color: 'transparent',
      cursor: 'pointer',
      backgroundColor: 'var(--bs-secondary-bg)',
      borderColor: 'transparent',
      borderRadius: '1rem'
    },

    '.form-range:disabled': {
      pointerEvents: 'none'
    },

    '.form-range:disabled::-webkit-slider-thumb': {
      backgroundColor: 'var(--bs-secondary-color)'
    },

    '.form-range:disabled::-moz-range-thumb': {
      backgroundColor: 'var(--bs-secondary-color)'
    },

    /* ======================
          .form-floating
    ====================== */

    '.form-floating': {
      position: 'relative'
    },

    '.form-floating > .form-control, .form-floating > .form-control-plaintext, .form-floating > .form-select':
      {
        height: 'calc(3.5rem + calc(var(--bs-border-width) * 2))',
        minHeight: 'calc(3.5rem + calc(var(--bs-border-width) * 2))',
        lineHeight: '1.25'
      },

    '.form-floating > label': {
      position: 'absolute',
      top: '0',
      left: '0',
      zIndex: '2',
      height: '100%',
      padding: '1rem 0.75rem',
      overflow: 'hidden',
      textAlign: 'start',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      border: 'var(--bs-border-width) solid transparent',
      transformOrigin: '0 0',
      transition: 'opacity 0.1s ease-in-out, transform 0.1s ease-in-out'
    },

    // @media (prefers-reduced-motion: reduce) {
    //   .form-floating > label {
    //     transition: none;
    //   }
    // }

    '.form-floating > .form-control, .form-floating > .form-control-plaintext':
      {
        padding: '1rem 0.75rem'
      },

    '.form-floating > .form-control::-moz-placeholder, .form-floating > .form-control-plaintext::-moz-placeholder':
      {
        color: 'transparent'
      },

    '.form-floating > .form-control::placeholder, .form-floating > .form-control-plaintext::placeholder':
      {
        color: 'transparent'
      },

    '.form-floating > .form-control:not(:-moz-placeholder-shown), .form-floating > .form-control-plaintext:not(:-moz-placeholder-shown)':
      {
        paddingTop: '1.625rem',
        paddingBottom: '0.625rem'
      },

    '.form-floating > .form-control:focus, .form-floating > .form-control:not(:placeholder-shown), .form-floating > .form-control-plaintext:focus, .form-floating > .form-control-plaintext:not(:placeholder-shown)':
      {
        paddingTop: '1.625rem',
        paddingBottom: '0.625rem'
      },

    '.form-floating > .form-control:-webkit-autofill, .form-floating > .form-control-plaintext:-webkit-autofill':
      {
        paddingTop: '1.625rem',
        paddingBottom: '0.625rem'
      },

    '.form-floating > .form-select': {
      paddingTop: '1.625rem',
      paddingBottom: '0.625rem'
    },

    '.form-floating > .form-control:not(:-moz-placeholder-shown) ~ label': {
      color: 'rgba(var(--bs-body-color-rgb), 0.65)',
      transform: 'scale(0.85) translateY(-0.5rem) translateX(0.15rem)'
    },

    '.form-floating > .form-control:focus ~ label, .form-floating > .form-control:not(:placeholder-shown) ~ label, .form-floating > .form-control-plaintext ~ label, .form-floating > .form-select ~ label':
      {
        color: 'rgba(var(--bs-body-color-rgb), 0.65)',
        transform: 'scale(0.85) translateY(-0.5rem) translateX(0.15rem)'
      },

    '.form-floating > .form-control:not(:-moz-placeholder-shown) ~ label::after':
      {
        position: 'absolute',
        inset: '1rem 0.375rem',
        zIndex: '-1',
        height: '1.5em',
        content: "''",
        backgroundColor: 'var(--bs-body-bg)',
        borderRadius: 'var(--bs-border-radius)'
      },

    '.form-floating > .form-control:focus ~ label::after, .form-floating > .form-control:not(:placeholder-shown) ~ label::after, .form-floating > .form-control-plaintext ~ label::after, .form-floating > .form-select ~ label::after':
      {
        position: 'absolute',
        inset: '1rem 0.375rem',
        zIndex: '-1',
        height: '1.5em',
        content: "''",
        backgroundColor: 'var(--bs-body-bg)',
        borderRadius: 'var(--bs-border-radius)'
      },

    '.form-floating > .form-control:-webkit-autofill ~ label': {
      color: 'rgba(var(--bs-body-color-rgb), 0.65)',
      transform: 'scale(0.85) translateY(-0.5rem) translateX(0.15rem)'
    },

    '.form-floating > .form-control-plaintext ~ label': {
      borderWidth: 'var(--bs-border-width) 0'
    },

    '.form-floating > :disabled ~ label, .form-floating > .form-control:disabled ~ label':
      {
        color: '#6c757d'
      },

    '.form-floating > :disabled ~ label::after, .form-floating > .form-control:disabled ~ label::after':
      {
        backgroundColor: 'var(--bs-secondary-bg)'
      },

    /* ======================
          .input-group
    ====================== */

    '.input-group': {
      position: 'relative',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'stretch',
      width: '100%'
    },

    '.input-group > .form-control, .input-group > .form-select, .input-group > .form-floating':
      {
        position: 'relative',
        flex: '1 1 auto',
        width: '1%',
        minWidth: '0'
      },

    '.input-group > .form-control:focus, .input-group > .form-select:focus, .input-group > .form-floating:focus-within':
      {
        zIndex: '5'
      },

    '.input-group .btn': {
      position: 'relative',
      zIndex: '2'
    },

    '.input-group .btn:focus': {
      zIndex: '5'
    },

    '.input-group-text': {
      display: 'flex',
      alignItems: 'center',
      padding: '0.375rem 0.75rem',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: 'var(--bs-body-color)',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      backgroundColor: 'var(--bs-tertiary-bg)',
      border: 'var(--bs-border-width) solid var(--bs-border-color)',
      borderRadius: 'var(--bs-border-radius)'
    },

    '.input-group-lg > .form-control, .input-group-lg > .form-select, .input-group-lg > .input-group-text, .input-group-lg > .btn':
      {
        padding: '0.5rem 1rem',
        fontSize: '1.25rem',
        borderRadius: 'var(--bs-border-radius-lg)'
      },

    '.input-group-sm > .form-control, .input-group-sm > .form-select, .input-group-sm > .input-group-text, .input-group-sm > .btn':
      {
        padding: '0.25rem 0.5rem',
        fontSize: '0.875rem',
        borderRadius: 'var(--bs-border-radius-sm)'
      },

    '.input-group-lg > .form-select, .input-group-sm > .form-select': {
      paddingRight: '3rem'
    },

    '.input-group:not(.has-validation) > :not(:last-child):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating), .input-group:not(.has-validation) > .dropdown-toggle:nth-last-child(n+3), .input-group:not(.has-validation) > .form-floating:not(:last-child) > .form-control, .input-group:not(.has-validation) > .form-floating:not(:last-child) > .form-select':
      {
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0'
      },

    '.input-group.has-validation > :nth-last-child(n+3):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating), .input-group.has-validation > .dropdown-toggle:nth-last-child(n+4), .input-group.has-validation > .form-floating:nth-last-child(n+3) > .form-control, .input-group.has-validation > .form-floating:nth-last-child(n+3) > .form-select':
      {
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0'
      },

    '.input-group > :not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback)':
      {
        marginLeft: 'calc(var(--bs-border-width) * -1)',
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0'
      },

    '.input-group > .form-floating:not(:first-child) > .form-control, .input-group > .form-floating:not(:first-child) > .form-select':
      {
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0'
      },

    /* ======================
      Validation (Valid)
    ====================== */

    '.valid-feedback': {
      display: 'none',
      width: '100%',
      marginTop: '0.25rem',
      fontSize: '0.875em',
      color: 'var(--bs-form-valid-color)'
    },

    '.valid-tooltip': {
      position: 'absolute',
      top: '100%',
      zIndex: '5',
      display: 'none',
      maxWidth: '100%',
      padding: '0.25rem 0.5rem',
      marginTop: '0.1rem',
      fontSize: '0.875rem',
      color: '#fff',
      backgroundColor: 'var(--bs-success)',
      borderRadius: 'var(--bs-border-radius)'
    },

    '.was-validated :valid ~ .valid-feedback, .was-validated :valid ~ .valid-tooltip, .is-valid ~ .valid-feedback, .is-valid ~ .valid-tooltip':
      {
        display: 'block'
      },

    '.was-validated .form-control:valid, .form-control.is-valid': {
      borderColor: 'var(--bs-form-valid-border-color)',
      paddingRight: 'calc(1.5em + 0.75rem)',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right calc(0.375em + 0.1875rem) center',
      backgroundSize: 'calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)'
    },

    '.was-validated .form-control:valid:focus, .form-control.is-valid:focus': {
      borderColor: 'var(--bs-form-valid-border-color)',
      boxShadow: '0 0 0 0.25rem rgba(var(--bs-success-rgb), 0.25)'
    },

    '.was-validated textarea.form-control:valid, textarea.form-control.is-valid':
      {
        paddingRight: 'calc(1.5em + 0.75rem)',
        backgroundPosition:
          'top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem)'
      },

    '.was-validated .form-select:valid, .form-select.is-valid': {
      borderColor: 'var(--bs-form-valid-border-color)'
    },

    '.was-validated .form-select:valid:not([multiple]):not([size]), .was-validated .form-select:valid:not([multiple])[size="1"], .form-select.is-valid:not([multiple]):not([size]), .form-select.is-valid:not([multiple])[size="1"]':
      {
        '--bs-form-select-bg-icon': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")`,
        paddingRight: '4.125rem',
        backgroundPosition: 'right 0.75rem center, center right 2.25rem',
        backgroundSize:
          '16px 12px, calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)'
      },

    '.was-validated .form-select:valid:focus, .form-select.is-valid:focus': {
      borderColor: 'var(--bs-form-valid-border-color)',
      boxShadow: '0 0 0 0.25rem rgba(var(--bs-success-rgb), 0.25)'
    },

    '.was-validated .form-control-color:valid, .form-control-color.is-valid': {
      width: 'calc(3rem + calc(1.5em + 0.75rem))'
    },

    '.was-validated .form-check-input:valid, .form-check-input.is-valid': {
      borderColor: 'var(--bs-form-valid-border-color)'
    },

    '.was-validated .form-check-input:valid:checked, .form-check-input.is-valid:checked':
      {
        backgroundColor: 'var(--bs-form-valid-color)'
      },

    '.was-validated .form-check-input:valid:focus, .form-check-input.is-valid:focus':
      {
        boxShadow: '0 0 0 0.25rem rgba(var(--bs-success-rgb), 0.25)'
      },

    '.was-validated .form-check-input:valid ~ .form-check-label, .form-check-input.is-valid ~ .form-check-label':
      {
        color: 'var(--bs-form-valid-color)'
      },

    '.form-check-inline .form-check-input ~ .valid-feedback': {
      marginLeft: '0.5em'
    },

    '.was-validated .input-group > .form-control:not(:focus):valid, .input-group > .form-control:not(:focus).is-valid, .was-validated .input-group > .form-select:not(:focus):valid, .input-group > .form-select:not(:focus).is-valid, .was-validated .input-group > .form-floating:not(:focus-within):valid, .input-group > .form-floating:not(:focus-within).is-valid':
      {
        zIndex: '3'
      },

    /* ======================
      Validation (Invalid)
    ====================== */

    '.invalid-feedback': {
      display: 'none',
      width: '100%',
      marginTop: '0.25rem',
      fontSize: '0.875em',
      color: 'var(--bs-form-invalid-color)'
    },

    '.invalid-tooltip': {
      position: 'absolute',
      top: '100%',
      zIndex: '5',
      display: 'none',
      maxWidth: '100%',
      padding: '0.25rem 0.5rem',
      marginTop: '0.1rem',
      fontSize: '0.875rem',
      color: '#fff',
      backgroundColor: 'var(--bs-danger)',
      borderRadius: 'var(--bs-border-radius)'
    },

    '.was-validated :invalid ~ .invalid-feedback, .was-validated :invalid ~ .invalid-tooltip, .is-invalid ~ .invalid-feedback, .is-invalid ~ .invalid-tooltip':
      {
        display: 'block'
      },

    '.was-validated .form-control:invalid, .form-control.is-invalid': {
      borderColor: 'var(--bs-form-invalid-border-color)',
      paddingRight: 'calc(1.5em + 0.75rem)',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right calc(0.375em + 0.1875rem) center',
      backgroundSize: 'calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)'
    },

    '.was-validated .form-control:invalid:focus, .form-control.is-invalid:focus':
      {
        borderColor: 'var(--bs-form-invalid-border-color)',
        boxShadow: '0 0 0 0.25rem rgba(var(--bs-danger-rgb), 0.25)'
      },

    '.was-validated textarea.form-control:invalid, textarea.form-control.is-invalid':
      {
        paddingRight: 'calc(1.5em + 0.75rem)',
        backgroundPosition:
          'top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem)'
      },

    '.was-validated .form-select:invalid, .form-select.is-invalid': {
      borderColor: 'var(--bs-form-invalid-border-color)'
    },

    '.was-validated .form-select:invalid:not([multiple]):not([size]), .was-validated .form-select:invalid:not([multiple])[size="1"], .form-select.is-invalid:not([multiple]):not([size]), .form-select.is-invalid:not([multiple])[size="1"]':
      {
        '--bs-form-select-bg-icon': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")`,
        paddingRight: '4.125rem',
        backgroundPosition: 'right 0.75rem center, center right 2.25rem',
        backgroundSize:
          '16px 12px, calc(0.75em + 0.375rem) calc(0.75em + 0.375rem)'
      },

    '.was-validated .form-select:invalid:focus, .form-select.is-invalid:focus':
      {
        borderColor: 'var(--bs-form-invalid-border-color)',
        boxShadow: '0 0 0 0.25rem rgba(var(--bs-danger-rgb), 0.25)'
      },

    '.was-validated .form-control-color:invalid, .form-control-color.is-invalid':
      {
        width: 'calc(3rem + calc(1.5em + 0.75rem))'
      },

    '.was-validated .form-check-input:invalid, .form-check-input.is-invalid': {
      borderColor: 'var(--bs-form-invalid-border-color)'
    },

    '.was-validated .form-check-input:invalid:checked, .form-check-input.is-invalid:checked':
      {
        backgroundColor: 'var(--bs-form-invalid-color)'
      },

    '.was-validated .form-check-input:invalid:focus, .form-check-input.is-invalid:focus':
      {
        boxShadow: '0 0 0 0.25rem rgba(var(--bs-danger-rgb), 0.25)'
      },

    '.was-validated .form-check-input:invalid ~ .form-check-label, .form-check-input.is-invalid ~ .form-check-label':
      {
        color: 'var(--bs-form-invalid-color)'
      },

    '.form-check-inline .form-check-input ~ .invalid-feedback': {
      marginLeft: '0.5em'
    },

    '.was-validated .input-group > .form-control:not(:focus):invalid, .input-group > .form-control:not(:focus).is-invalid, .was-validated .input-group > .form-select:not(:focus):invalid, .input-group > .form-select:not(:focus).is-invalid, .was-validated .input-group > .form-floating:not(:focus-within):invalid, .input-group > .form-floating:not(:focus-within).is-invalid':
      {
        zIndex: '4'
      }
  })
})
