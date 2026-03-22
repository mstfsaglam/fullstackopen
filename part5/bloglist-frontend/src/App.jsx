import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const timeoutRef = useRef(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs( blogs ))  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const LoggedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(LoggedUser.token)
      setUser(LoggedUser)
    } 
  }, [])

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login( credentials )
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      showNotification('wrong username or password!', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    showNotification('logged out successfully')
  }

  const handleBlogForm = async newBlog => {
    try {
      const response = await blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(response))
      showNotification(`a new blog ${response.title} by ${response.author} added`)
    } catch {
      showNotification('blog creation failed', 'error')
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  if (!user) {
    return (
      <>
        <h1>log in to application</h1>
        <Notification notification={notification} />
        <LoginForm handleLogin={handleLogin} />
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification notification={notification}/>

      <p>{user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel={'create new blog'} ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm handleBlogForm={handleBlogForm}/>
      </Togglable>
      
      <BlogList blogs={blogs}/>
    </div>
  )
}

export default App