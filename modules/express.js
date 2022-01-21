const cors = require('cors')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const requestID = require('express-request-id')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(requestID());

app.use(express.static('./public'));

const routes = new(require('./routes'))(app).routerList();

module.exports = app;