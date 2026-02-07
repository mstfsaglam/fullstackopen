const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes).reduce((acc, blog) => acc + blog, 0)
  console.log(likes)
  return likes;
}

const favoriteBlog = (blogs) => {
  let favBlog = blogs[0]

  blogs.map(blog => favBlog.likes < blog.likes
    ? favBlog = blog
    : favBlog
  )
  console.log(favBlog)
  return favBlog
}

module.exports = { totalLikes, dummy, favoriteBlog }