const express = require('express')
const itemRoutes = require('./itemRoutes')
const ExpressError = require('./ExpressError')

const app = express()

app.use(express.json())
app.use('/items', itemRoutes)


app.use((req, res, next) => {
    console.log('404 in here')
    const e = new ExpressError('nothing found here', 404)
    next(e)
})

app.use((err, req, res, next) => {
    console.log(err)
    let status = err.status || 500
    let msg = err.msg

    return res.status(status).json({
        error: { msg, status }
    })
})




module.exports = app