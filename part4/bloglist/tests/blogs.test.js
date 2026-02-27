const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('Blog helper functions', () => {
  test('total likes on blogs', () => {
    const result = listHelper.totalLikes(listHelper.blogList)
    assert.strictEqual(result, 36)
  })

  test('favorite likes on blogs', () => {
    const result = listHelper.favoriteBlog(listHelper.blogList)
    assert.deepStrictEqual(result, {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    })
  })

  test('Most blogs in Authors', () => {
    const result = listHelper.mostBlogs(listHelper.blogList)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('Most likes in Authors', () => {
    const result = listHelper.mostLikes(listHelper.blogList)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})

describe('Blog API', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const user = await User.create({
      username: 'root',
      passwordHash: await bcrypt.hash('secret', 1)
    })

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    token = loginResponse.body.token

    const blogObjects = listHelper.blogList.map(blog =>
      new Blog ({ ...blog, user: user._id })
    )
    await Blog.insertMany(blogObjects)
  })

  describe('GET /api/blogs', () => {
    test('succeeds get blogs from database', async () => {
      let blogs = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(blogs.body.length, listHelper.blogList.length)
    })

    test('Unique identifier property name', async () => {
      const blogs = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      blogs.body.forEach((blog, index) => {
        assert.ok(blog.id, `blog at index ${index} is missing id`)
      })
    })
  })

  describe('POST /api/blogs', () => {
    test('succeeds with valid token', async () => {
      const newBlog = {
        title: 'testing create blog',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 22,
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await listHelper.blogInDb()
      assert.strictEqual(response.length, listHelper.blogList.length + 1)

      const titles = response.map(blog => blog.title)
      assert(titles.includes('testing create blog'))
    })

    test('fails with 401 if token invalid', async () => {
      const newBlog = {
        title: 'testing fails with 401',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 22,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await listHelper.blogInDb()
      assert.strictEqual(blogsAtEnd.length, listHelper.blogList.length)
    })

    test('defaults likes to 0 if missing', async () => {
      const newBlog = {
        title: 'are likes exist',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await listHelper.blogInDb()
      const createdBlog = response.find(blog => blog.title === 'are likes exist')
      assert.strictEqual(createdBlog.likes, 0)
    })

    test('fails with 400 if title or url missing', async () => {
      const newBlog = {
        author: 'Edsger W. Dijkstra',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogs = await listHelper.blogInDb()
      assert.strictEqual(blogs.length, listHelper.blogList.length)
    })
  })

  describe('PUT /api/blogs', () => {
    test('succeeds update likes on blogs', async () => {
      const blogs = await listHelper.blogInDb()
      const id = blogs[0].id

      await api
        .put(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likes: 50 })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await listHelper.blogInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === id)
      assert.strictEqual(updatedBlog.likes, 50)
    })

    test('PUT fails with 403 if blog belongs to another user', async () => {
      // Create user 'first'
      const firstUser = await User.create({
        username: 'first',
        passwordHash: await bcrypt.hash('secret', 1)
      })

      // Login with user 'first'
      const firstUserLogin = await api
        .post('/api/login')
        .send({ username: firstUser.username, password: 'secret' })

      const firstToken = firstUserLogin.body.token

      const newBlog = {
        title: 'testing update with user auth',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 10,
      }

      // Create new blog with user 'first'
      const savedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${firstToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const id = savedBlog.body.id

      // Create user 'second'
      const secondUser = await User.create({
        username: 'second',
        passwordHash: await bcrypt.hash('secret', 1)
      })

      // Login with user 'second'
      const secondUserLogin = await api
        .post('/api/login')
        .send({ username: secondUser.username, password: 'secret' })

      const secondToken = secondUserLogin.body.token

      // Test to update the blog with user 'second'
      await api
        .put(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${secondToken}`)
        .send({ likes: 100 })
        .expect(403)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await listHelper.blogInDb()
      const createdBlog = blogsAtEnd.find(b => b.id === id)
      assert.strictEqual(createdBlog.likes, 10)
    })

    test('PUT fails with 401 if token missing', async () => {
      const blogs = await listHelper.blogInDb()
      const id = blogs[0].id

      await api
        .put(`/api/blogs/${id}`)
        .send({ likes: 100 })
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await listHelper.blogInDb()
      const createdBlog = blogsAtEnd.find(b => b.id === id)
      assert.strictEqual(createdBlog.likes, blogs[0].likes)
    })
  })

  describe('DELETE /api/blogs', () => {
    test('succeeds delete with valid token', async() => {
      const blogs = await listHelper.blogInDb()
      const id = blogs[0].id

      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await listHelper.blogInDb()
      assert.strictEqual(blogsAtEnd.length, listHelper.blogList.length - 1)
    })

    test('fails with 403 if blog belongs to another user', async () => {
      // Create user 'first'
      const firstUser = await User.create({
        username: 'first',
        passwordHash: await bcrypt.hash('secret', 1)
      })

      // Login with user 'first'
      const firstUserLogin = await api
        .post('/api/login')
        .send({ username: firstUser.username, password: 'secret' })

      const firstToken = firstUserLogin.body.token

      const newBlog = {
        title: 'testing delete with user auth',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 10,
      }

      // Create new blog with user 'first'
      const savedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${firstToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const id = savedBlog.body.id

      // Create user 'second'
      const secondUser = await User.create({
        username: 'second',
        passwordHash: await bcrypt.hash('secret', 1)
      })

      // Login with user 'second'
      const secondUserLogin = await api
        .post('/api/login')
        .send({ username: secondUser.username, password: 'secret' })

      const secondToken = secondUserLogin.body.token

      // Test to delete the blog with user 'second'
      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${secondToken}`)
        .expect(403)

      const blogsAtEnd = await listHelper.blogInDb()
      assert.strictEqual(blogsAtEnd.length, listHelper.blogList.length + 1)
    })

    test('fails with 401 if token invalid', async () => {
      const blogs = await listHelper.blogInDb()
      const id = blogs[0].id

      await api
        .delete(`/api/blogs/${id}`)
        .expect(401)

      const blogsAtEnd = await listHelper.blogInDb()
      assert(blogsAtEnd.length === listHelper.blogList.length)
    })
  })

})

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.create({
      username: 'root',
      passwordHash: await bcrypt.hash('secret', 1)
    })
  })

  test('succeeds creation with a new user', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'mstf',
      name: 'Mustafa',
      password: 'fullStack26'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('fails creation with 400 if username already taken', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'fullStack26'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})