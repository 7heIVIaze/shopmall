const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const cookieParser = require('cookie-parser')
require('dotenv').config()

// mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
  if (err) return console.error(err)
  console.log('mongoose connected!')
});



// body-parser
//const bodyParser = require('body-parser');
// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*") // test https://justright-shop.herokuapp.com
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next()
});
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' })
  console.log("connectd")
});

// passport
const passport = require('./user/userPassport.js')
const session = require('express-session')
app.use(
  session({
    secret: process.env.SESSION_SECRETKEY,
    resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
      },
      key:'connect.sid'
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())


// 라우팅 등록
app.use('/user', require('./user/index.js'))
app.use('/product', require('./product/index.js'))
app.use('/comment', require('./comment/index.js'))
app.use('/upload', require('./upload/upload_router'))

module.exports = {
  path: '/api',
  handler: app
}
