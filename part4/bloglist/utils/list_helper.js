const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce((fav, blog) => fav.likes < blog.likes
    ? fav = blog 
    : fav
    , blogs[0]
  )

  return favBlog
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, 'author')
  const blogsPerAuthor = Object.entries(blogsByAuthor).map(
    ([author, blogs]) => ({
      author,
      blogs: blogs.length
    })
  )
  const mostAuthor = _.maxBy(blogsPerAuthor, 'blogs')

  return mostAuthor
}

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, 'author')
  const totalByAuthor = Object.entries(blogsByAuthor).map(
    ([author, blogs]) => ({
      author,
      likes: _.sumBy(blogs, 'likes')
    })
  )
  const mostLikesAuthor = _.maxBy(totalByAuthor, 'likes')

  return mostLikesAuthor
}

module.exports = { 
  totalLikes,
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes
}