import Blog from './Blog'

const BlogList = ({ blogs, handleLikes }) => {
  return (
    <>
      {blogs.map(blog => 
        <Blog key={blog.id} blog={blog} handleLikes={handleLikes}/>
      )}
    </>
  )
}

export default BlogList