import { useState } from 'react'

const BlogForm = ({ handleBlogForm }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submit = event => {
    event.preventDefault()

    handleBlogForm({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label>
            title:
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle( target.value )}
          />
        </label>
      </div>

      <div>
        <label>
            author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor( target.value )}
          />
        </label>
      </div>

      <div>
        <label>
            url:
          <input
            type="url"
            value={url}
            onChange={({ target }) => setUrl( target.value )}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm