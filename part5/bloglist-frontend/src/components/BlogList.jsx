import Blog from './Blog'

const BlogList = ({ blogs, handleLikes }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <>
      {sortedBlogs.map(blog => 
        <Blog key={blog.id} blog={blog} handleLikes={handleLikes}/>
      )}
    </>
  )
}

export default BlogList