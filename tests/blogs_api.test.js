const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./blogtest_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('reading from blog list', () => {
    test('blogs are returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .set({Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1NWRjNjE3NDIyN2E1OTUyN2JkMjY0MyIsImlhdCI6MTcwMDY0NTE5OH0.IcQBOnM6hkSn4NAmnZE7ta434Og2ugg1u2M6hvwpUhg'})
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('verifying unique property of blog', async () => {
        const response = await api.get('/api/blogs')
        .set({Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1NWRjNjE3NDIyN2E1OTUyN2JkMjY0MyIsImlhdCI6MTcwMDY0NTE5OH0.IcQBOnM6hkSn4NAmnZE7ta434Og2ugg1u2M6hvwpUhg'})
        expect(response.body[0].id).toBeDefined()
    },100000)    
})

describe('adding to blog List', () => {
    test('a valid blog can be added', async () => {
        const newBlog =  {
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5
        }
    
        await api
            .post('/api/blogs')
            .set({Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1NWRjNjE3NDIyN2E1OTUyN2JkMjY0MyIsImlhdCI6MTcwMDY0NTE5OH0.IcQBOnM6hkSn4NAmnZE7ta434Og2ugg1u2M6hvwpUhg'})
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDB()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        
        const contents = blogsAtEnd.map(({id, user, ...blog}) => blog) 
        expect(contents).toContainEqual(newBlog)
    },100000)
    
    test('defaulting likes property value', async () => {
        const newBlog =  {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1NWRjNjE3NDIyN2E1OTUyN2JkMjY0MyIsImlhdCI6MTcwMDY0NTE5OH0.IcQBOnM6hkSn4NAmnZE7ta434Og2ugg1u2M6hvwpUhg'})
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDB()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        
        const updatedBlog = blogsAtEnd.filter(({id, ...blog}) => {
            if (blog.title == "Canonical string reduction") return blog
        })
        expect(updatedBlog[0].likes).toBe(0)
    })
    
    test("reject blog list with title or url missing", async () => {
        const newBlog =  {
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
        }
        
        await api
            .post('/api/blogs')
            .set({Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1NWRjNjE3NDIyN2E1OTUyN2JkMjY0MyIsImlhdCI6MTcwMDY0NTE5OH0.IcQBOnM6hkSn4NAmnZE7ta434Og2ugg1u2M6hvwpUhg'})
            .send(newBlog)
            .expect(400)
    })

    test('reject adding a blog if token not provided', async () => {
        const newBlog =  {
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    },100000)
})

describe('updating blog list', () => {
    test('update a blog list that exists by the same user', async () => {
        const blogAtStart = await helper.blogsInDB()
        const blogToUpdate = {
            likes: 10
        }

        await api
            .put(`/api/blogs/${blogAtStart[0].id}`)
            .set({Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1NWRjNjE3NDIyN2E1OTUyN2JkMjY0MyIsImlhdCI6MTcwMDY0NTE5OH0.IcQBOnM6hkSn4NAmnZE7ta434Og2ugg1u2M6hvwpUhg'})
            .send(blogToUpdate)
            .expect(200)

        const updatedBlog = await helper.blogInDB(blogAtStart[0].id)
        expect(updatedBlog[0].likes).toBe(10)
    }, 10000)

    test('update a blog list that doesnt exist', async () => {
        const blogAtStart = await helper.blogsInDB()
        const blogToUpdate = {
            likes: 10
        }

        await api
            .put('/api/blogs/65410571c89888e1b6640972')
            .set({Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1NWRjNjE3NDIyN2E1OTUyN2JkMjY0MyIsImlhdCI6MTcwMDY0NTE5OH0.IcQBOnM6hkSn4NAmnZE7ta434Og2ugg1u2M6hvwpUhg'})
            .send(blogToUpdate)
            .expect(402)
    }, 10000)

    test('reject updating a blog list that exists by a different user', async () => {
        const blogAtStart = await helper.blogsInDB()
        const blogToUpdate = {
            likes: 10
        }

        await api
            .put(`/api/blogs/${blogAtStart[0].id}`)
            .set({Authorization: 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1NWRjNjE3NDIyN2E1OTUyN2JkMjY0MyIsImlhdCI6MTcwMDY0NTE5OH0.IcQBOnM6hkSn4NAmnZE7ta434Og2ugg1u2M6hvwpUhg'})
            .send(blogToUpdate)
            .expect(401)
    }, 10000)
})

describe('deleting from blog list', () => {
    test('delete a blog that exists in the list by the same user', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1NWRjNjE3NDIyN2E1OTUyN2JkMjY0MyIsImlhdCI6MTcwMDY0NTE5OH0.IcQBOnM6hkSn4NAmnZE7ta434Og2ugg1u2M6hvwpUhg'})
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDB()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    })

    test('reject deleteting a blog that exists in the list by a different user', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({Authorization: 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1NWRjNjE3NDIyN2E1OTUyN2JkMjY0MyIsImlhdCI6MTcwMDY0NTE5OH0.IcQBOnM6hkSn4NAmnZE7ta434Og2ugg1u2M6hvwpUhg'})
            .expect(401)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
},100000)