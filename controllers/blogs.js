const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response, next) => {
    const blog = request.body

    userList = await User.find({})
    blog.user = userList[0]._id
    
    const newBlog = new Blog(blog)

    const savedBlog = await newBlog.save()
    userList[0].blogs = userList[0].blogs.concat(savedBlog._id)
    await userList[0].save()
    response.status(201).json(savedBlog)
  })

  blogsRouter.delete('/:id', async (request, response, next) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  })

  blogsRouter.put('/:id', async (request, response, next) => {
    const blog = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog , {new: true})
    response.json(updatedBlog)
  })

module.exports = blogsRouter