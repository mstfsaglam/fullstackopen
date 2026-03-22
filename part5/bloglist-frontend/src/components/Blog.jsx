import { useState } from "react"

const Blog = ({ blog }) => {
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
          <br />
          {blog.user.name}
        </div>
      )}
    </div>  
  )
}

export default Blog