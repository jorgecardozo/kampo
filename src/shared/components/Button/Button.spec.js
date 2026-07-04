import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from './index'

describe('Home', () => {
  it('renders a button', () => {
    render(<Button>My Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})
