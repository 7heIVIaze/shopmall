const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)
  // app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "https://justright-shop.herokuapp.com") // test http://172.27.128.1:5000
  //   res.header('Access-Control-Allow-Credentials', true)
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  //   next()
  // });
  // io.on('connection', function (socket) {
  //   socket.emit('news', { hello: 'world' })
  //   console.log("connectd")
  // });


  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
