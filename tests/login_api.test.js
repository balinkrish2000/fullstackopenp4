const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('generate json web token for user login', async () => {
    const user = {
        username: 'test',
        password: 'test'
    }

    const result = await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    console.log(result)
})