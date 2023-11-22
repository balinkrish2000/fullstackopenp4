// const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

// BELOW FUNCTION IS NOW MOVED TO MIDDLEWARE
// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if(authorization && authorization.startsWith('Bearer ')){
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response, next) => {
    const blog = request.body
    const user = await User.findById(request.user)

    blog.user = user._id
    
    const newBlog = new Blog(blog)
    const savedBlog = await newBlog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    
    await user.save()

    response.status(201).json(savedBlog)
  })

  blogsRouter.delete('/:id', async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      response.status(401).json({error: 'blog not found'})
    }

    if (blog.user.toString() === request.user.toString()) {
      await Blog.findByIdAndRemove(request.params.id)

      const user = await User.findById(request.user)
      user.blogs.remove(blog._id)
      await user.save()

      response.status(204).end()
    } else {
      response.status(403).json({error: 'user not authorized to delete this blog'})
    }

  })

  blogsRouter.put('/:id', async (request, response, next) => {
    const blog = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog , {new: true})
    response.json(updatedBlog)
  })

module.exports = blogsRouter