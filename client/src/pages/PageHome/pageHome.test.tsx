import { render, screen } from '@testing-library/react'

import PageHome from './'

describe('PageHome', () => {
  test("should render 'Home'", async () => {
    render(<PageHome />)
    // screen.debug()
    const title = await screen.findByText('Home')
    expect(title).toBeInTheDocument()
  })
})
