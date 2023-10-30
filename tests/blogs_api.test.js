const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./blogtest_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const PromiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(PromiseArray)
}

)

test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('verifying unique property of blog', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
},100000)

test('a valid blog can be added', async () => {
    const newBlog =  {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
    const contents = blogsAtEnd.map(({id, ...blog}) => blog) 
    expect(contents).toContainEqual(newBlog)
},100000)

afterAll(async () => {
    await mongoose.connection.close()
})