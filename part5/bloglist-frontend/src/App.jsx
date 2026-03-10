import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import CreateBlog from './components/CreateBlog'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs( blogs ))  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    } 
  }, [])

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login( credentials )
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
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

  const handleCreateBlog = async newBlog => {
    const response = await blogService.create(newBlog)
    setBlogs(blogs.concat(response))
  }

  if (!user) {
    return <LoginForm handleLogin={handleLogin} />
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in
        <button onClick={() => handleLogout()}>logout</button>
      </p>

      <h2>create new</h2>
      <CreateBlog handleCreateBlog={handleCreateBlog}/>
      
      <BlogList blogs={blogs}/>
    </div>
  )
}

export default App