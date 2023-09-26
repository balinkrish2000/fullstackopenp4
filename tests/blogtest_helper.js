const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    }
]

const blogsInDB = ( async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
})

module.exports = {
    initialBlogs, blogsInDB
}