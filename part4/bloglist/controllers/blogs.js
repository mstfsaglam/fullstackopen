const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  // const blog = request.body

  const users = await User.find({})
  const user = users[0]

  console.log(user)

  const blog = new Blog({
    title: 'example for user administration',
    author: 'Mustafa',
    url: 'https://www.example.com',
    likes: 17,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    blog.likes = request.body.likes
    const updatedBlog = await blog.save()
    response.status(200).json(updatedBlog)
  }
})

module.exports = blogsRouter