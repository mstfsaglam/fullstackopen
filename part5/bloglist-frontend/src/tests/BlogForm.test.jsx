import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

test('<BlogForm /> calls event handler with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm handleBlogForm={createBlog} />)

  await user.type(screen.getByLabelText('title:'), 'testing a blog form')
  await user.type(screen.getByLabelText('author:'), 'test user')
  await user.type(screen.getByLabelText('url:'), 'https://test.com')

  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'testing a blog form',
    author: 'test user',
    url: 'https://test.com'
  })
})