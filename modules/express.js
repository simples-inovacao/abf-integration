const cors = require('cors')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const requestID = require('express-request-id')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(requestID());

app.use(express.static('./public'));

const routes = new(require('./routes'))(app).routerList();

module.exports = app;