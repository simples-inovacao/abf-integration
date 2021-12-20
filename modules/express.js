const cors = require('cors')
const express = require('express')
const app = express()
const routes = new(require('./routes'))(app).routerList();
const bodyParser = require('body-parser')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

module.exports = app;