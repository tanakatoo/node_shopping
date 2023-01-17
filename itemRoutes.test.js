process.env.NODE_ENV = "test"

const request = require('supertest')
const app = require('./app')
let items = require('./fakeDb')

beforeEach(() => {
    items.push({ name: "popsicle", price: 1.45 })
    items.push({ name: "kale", price: 2.99 })
})
afterEach(function () {
    items.length = 0
})
let newItem = { name: "ice cream", price: 5.99 }

test("/GET route", async () => {
    let res = await request(app).get('/items')
    expect(res.statusCode).toBe(200)
    console.log(res.body)
    expect(res.body).toEqual([
        {
            "name": "popsicle",
            "price": 1.45
        },
        {
            "name": "kale",
            "price": 2.99
        }
    ])
})
describe('/get/:name', function () {
    test('success', async () => {
        let res = await request(app).get('/items/popsicle')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            "name": "popsicle",
            "price": 1.45
        })
    })

    test('not found', async () => {
        let res = await request(app).get('/items/popsicles')
        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({
            "error": {
                "msg": "no item found",
                "status": 401
            }
        })
    })
})

describe('patch /items/:name', function () {
    test('success', async () => {
        let res = await request(app).patch('/items/popsicle').send({
            "name": "ice cream",
            "price": 1.99
        })
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            "updated": {
                "name": "ice cream",
                "price": 1.99
            }
        })
    })

    test('not found', async () => {
        let res = await request(app).patch('/items/popsicles').send({
            "name": "ice cream",
            "price": 1.99
        })
        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({
            "error": {
                "msg": "no item found",
                "status": 401
            }
        })
    })
})
test('/items post route', async () => {
    let res = await request(app).post('/items').send({
        "name": "ice cream",
        "price": 1.99
    })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
        "added": {
            "name": "ice cream",
            "price": 1.99
        }
    })
})

test('/items delete route', async () => {
    let res = await request(app).delete('/items/popsicle')
    expect(res.statusCode).toBe(200)
    console.log()
    expect(res.body).toEqual({
        "message": "deleted"
    })
})