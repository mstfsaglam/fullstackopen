const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

describe('When there is initially blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(listHelper.blogList)
  })

  describe('blog list helper functions', () => {
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

  describe('Getting blogs and control property names', () => {
    test('Get all blogs from database', async () => {
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

  describe('Check creating new blogs and exist properties', () => {
    test('Creating new blog', async () => {
      const newBlog = {
        title: 'testing create blog',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 22,
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await listHelper.blogInDb()
      assert.strictEqual(response.length, listHelper.blogList.length + 1)

      const titles = response.map(blog => blog.title)
      assert(titles.includes('testing create blog'))
    })

    test('are likes exist in blog', async () => {
      const newBlog = {
        title: 'are likes exist',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await listHelper.blogInDb()
      const createdBlog = response.find(blog => blog.title === 'are likes exist')
      assert.strictEqual(createdBlog.likes, 0)
    })

    test('are title and URL exist in blog', async () => {
      const newBlog = {
        author: 'Edsger W. Dijkstra',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogs = await listHelper.blogInDb()
      assert.strictEqual(blogs.length, listHelper.blogList.length)
    })
  })

  describe('update a blog', () => {
    test('update blogs likes', async () => {
      const blogs = await listHelper.blogInDb()
      const id = blogs[0].id
      await api
        .put(`/api/blogs/${id}`)
        .send({ likes: 50 })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const response = await listHelper.blogInDb()
      const update = response.find(blog => blog.id === id)
      assert.strictEqual(update.likes, 50)
    })
  })

  describe('delete a blog', () => {
    test('delete a blog by id', async() => {
      const blogs = await listHelper.blogInDb()
      const id = blogs[0].id
      await api
        .delete(`/api/blogs/${id}`)
        .expect(204)
      const response = await listHelper.blogInDb()
      assert.strictEqual(response.length, listHelper.blogList.length - 1)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})