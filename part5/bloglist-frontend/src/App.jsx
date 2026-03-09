import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    } 
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setTimeout(() => {
        console.log('wrong credentials')
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async event => {
    event.preventDefault()
    
    const newBlog = {
      title,
      author,
      url,
    }
    const response = await blogService.create(newBlog)
    setBlogs(blogs.concat(response))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const loginForm = () => (
     <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              text="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
     </div>
  )

  const blogFrom = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in
            <button onClick={() => handleLogout()}>logout</button>
          </p>
          {blogFrom()}
        </div>
      )}
    </div>
  )
}

export default App