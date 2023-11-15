const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./blogtest_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: 'root', passwordHash})

    await user.save()
})

describe('When there is initially one user in db', () => {
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'test',
            name: 'tester',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
})

describe('invalid username and password validations', () => {
    test('username not provided', async () => {
        const newUser = {
            name: 'tester',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('password not provided', async () => {
        const newUser = {
            username: 'test',
            name: 'tester'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('password less than required length', async () => {
        const newUser = {
            username: 'test',
            name: 'tester',
            password: 'te'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('username less than 3 chars', async () => {
        const newUser = {
            username: 't1',
            name: 'tester',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('duplicate username', async() => {
        const newUser = {
            username: 'root',
            name: 'tester',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })
})