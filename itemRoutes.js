const express = require('express')
const router = new express.Router()
const ExpressError = require('./ExpressError')
let items = require('./fakeDb')

items.push({ name: "popsicle", price: 1.45 })
items.push({ name: "kale", price: 2.99 })
// each item {key:price}
router.get('/', (req, res) => {
    // return [{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]
    return res.json(items)
})

router.post('/', (req, res) => {
    // gets and returns {“name”:”popsicle”, “price”: 1.45} => {“added”: {“name”: “popsicle”, “price”: 1.45}}
    const name = req.body.name
    const price = req.body.price
    const objToAdd = { name: name, price: price }
    items.push(objToAdd)
    return res.json({ added: objToAdd })

})

router.get('/:name', (req, res, next) => {
    // returns {“name”: “popsicle”, “price”: 1.45}
    const name = req.params.name
    const found = items.find(n => n.name == name)

    if (found) {
        return res.json(found)
    } else {
        const e = new ExpressError('no item found', 401)
        next(e)
    }
})

router.patch('/:name', (req, res) => {
    // returns and gets {“name”:”new popsicle”, “price”: 2.45} => {“updated”: {“name”: “new popsicle”, “price”: 2.45}}
    const name = req.params.name
    const newName = req.body.name
    const newPrice = req.body.price
    const found = items.find(n => n.name == name)

    if (found) {

        found.name = newName
        found.price = newPrice
        return res.json({ updated: { name: newName, price: newPrice } })
    } else {
        const e = new ExpressError('no item found', 401)
        next(e)
    }
})

router.delete('/:name', (req, res) => {
    // returns {message: “Deleted”}
    const name = req.params.name
    const found = items.findIndex(n => n.name == name)

    if (found) {
        console.log(found)
        items.splice(found, 1)
        console.log(items)
        res.json({ message: "deleted" })
    } else {
        const e = new ExpressError('no item found', 401)
        next(e)
    }
})

module.exports = router