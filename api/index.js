const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
require('dotenv').config()
const cookieParser = require('cookie-parser')
const router = express.Router()

// mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
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
  res.header("Access-Control-Allow-Origin", "https://justright-shop.herokuapp.com") // test http://192.168.0.6:8080
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next()
});
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' })
  console.log("connectd")
});
app.use(cookieParser());

// passport
const passport = require('./user/userPassport.js')
const session = require('express-session')
// app.use(session({ 
//   key: 'sid',
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 24000 * 60 * 60
//   }
// }))
app.use(passport.initialize())
app.use(passport.session())



// 라우팅 등록
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})
app.use('/user', require('./user/index.js'))
app.use('/product', require('./product/index.js'))
app.use('/comment', require('./comment/index.js'))

module.exports = {
  path: '/api',
  handler: app
}
