const express = require('express')
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
require('dotenv').config()

// mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) return console.error(err)
  console.log('mongoose connected!')
});



// body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  //res.header("Access-Control-Allow-Origin", "https://192.168.0.6:8080")
  res.header('Access-Control-Allow-Credentials', true)
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE")
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
});
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' })
  console.log("connectd")
});

// passport
const passport = require('./user/userPassport.js')
const session = require('express-session')
app.use(passport.initialize())
app.use(passport.session())



// 라우팅 등록
app.use('/user', require('./user/index.js'))
app.use('/product', require('./product/index.js'))
app.use('/comment', require('./comment/index.js'))

module.exports = {
  path: '/api',
  handler: app
}
