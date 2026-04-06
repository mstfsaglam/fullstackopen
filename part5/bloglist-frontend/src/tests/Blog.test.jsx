import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('url and likes are shown when view button is clicked', async () => {
  const blog = {
    title: 'second test',
    author: 'admin',
    url: 'https://test.com',
    likes: 0,
    user: {
      name: 'user for test',
      username: 'admin'
    }
  }

  const testUser = {
    username: 'admin'
  }

  render(<Blog blog={blog} user={testUser}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = await screen.findByText(/https:\/\/test.com/)
  const likesElement = screen.getByText(/likes 0/)

  expect(urlElement).toBeVisible()
  expect(likesElement).toBeVisible()
})