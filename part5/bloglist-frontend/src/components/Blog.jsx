import { useState } from 'react'

const Blog = ({ blog, handleLikes, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide': 'view'}
      </button>
      {visible && (
        <div>
          {blog.url}
          <br />

          likes {blog.likes}
          <button onClick={() => handleLikes(blog)}>like</button>
          <br />

          {blog.user.name}
          <br />

          {( user.username === blog.user?.username ) && (
            <button
              onClick={() => handleDelete(blog)}
              style={{ background: 'red' }}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog