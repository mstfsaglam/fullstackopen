import Blog from './Blog'

const BlogList = ({ blogs, handleLikes, handleDelete, user }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <>
      {sortedBlogs.map(blog => 
        <Blog
          key={blog.id}
          blog={blog}
          handleLikes={handleLikes}
          handleDelete={handleDelete}
          user={user}
        />
      )}
    </>
  )
}

export default BlogList