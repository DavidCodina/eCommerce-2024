// https://github.com/vitest-dev/vitest/blob/main/examples/react-testing-lib/src/test/setup.ts
// The actual vitest example ONLY does this, and it works.
// What Robin Wieruch does in his tutorial also works, but is unnecessary.
import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from 'mocks/server'

/* ======================
    matchMedia (mock)
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Gotcha when using createMiniRouter() :
//
// Error: Uncaught [TypeError: window.matchMedia is not a function]
// This happens because ThemeProvider uses window.matchMedia and ThemeProvider
// is used in is used in RootLayout. For Jest, the official solution to this
// is found here:
//
//   https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
//
//   Object.defineProperty(window, 'matchMedia', {
//     writable: true,
//     // enumerable: true,
//     value: vi.fn().mockImplementation((query) => ({
//       matches: false,
//       media: query,
//       onchange: null,
//       addListener: vi.fn(), // Deprecated
//       removeListener: vi.fn(), // Deprecated
//       addEventListener: vi.fn(),
//       removeEventListener: vi.fn(),
//       dispatchEvent: vi.fn()
//     }))
//   })
//
// The Object.defineProperty() static method defines a new property directly on an object,
// or modifies an existing property on an object, and returns the object.
//
// Normally, you'd need to have created an object beforehand. However, the actual window
// object is globally available. However, in this case, the file is not being run in the
// browser. Presumably, the window object here is the one created in memory by JSDOM.
//
// The above solution seems to also work in Vitest, but the official Vitest solution
// looks a little different: https://vitest.dev/guide/mocking.html#globals
//
// Curiously, it doesn't seem like we even need to import matchMedia at all.
// I think it just works because we are accessing this file wherever we do
//
//   import { createMiniRouter } from 'utils'
//
///////////////////////////////////////////////////////////////////////////

const matchMedia = vi.fn((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // Deprecated
  removeListener: vi.fn(), // Deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}))

vi.stubGlobal('matchMedia', matchMedia) // Now you can access it as `matchMedia` or `window.matchMedia`

/* ======================

====================== */

// Establish API mocking before all tests.
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())

/* =============================================================================

============================================================================= */

// The The Robin Wieruch tutorial does this
// import { expect, afterEach  } from 'vitest'
// import { cleanup } from '@testing-library/react'
// import matchers from '@testing-library/jest-dom/matchers'

// extends Vitest's expect method with methods from react-testing-library
// expect.extend(matchers)

///////////////////////////////////////////////////////////////////////////
//
// The Robin Wieruch tutorial: https://www.robinwieruch.de/vitest-react-testing-library/
// adds in the logic for running a cleanup function after each test  (e.g. clearing jsdom).
// However, KCD lists this as a common mistake:
// https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#using-cleanup
// "For a long time now cleanup happens automatically (supported for most major testing frameworks)
// and you no longer need to worry about it."
//
// Moreover, the official example in vitest docs doesn't do this.
// For now, I'm omitting this.
//
///////////////////////////////////////////////////////////////////////////
// afterEach(() => { cleanup() })
