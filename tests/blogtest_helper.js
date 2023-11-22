const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: '655dc6174227a59527bd2643'
    }
]

const blogsInDB = ( async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
})

const blogInDB = ( async (id) => {
    const blogs = await Blog.find({_id:id})
    return blogs.map(blog => blog.toJSON())
})

const usersInDB = ( async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
})

module.exports = {
    initialBlogs, blogsInDB, blogInDB, usersInDB
}