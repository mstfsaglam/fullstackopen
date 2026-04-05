import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'

test('renders blog title and blog author', () => {
  const blog = {
    title: 'first test',
    author: 'user'
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText(/first test/)
  const authorElement = screen.getByText(/user/)
  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
})