const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
var cors = require('cors')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const { VRadio } = require('vuetify/lib')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

 // var port = process.env.PORT || 80;
 // var host = process.env.HOST || '0.0.0.0';

  // Build only in dev mode
  if (config.dev) {
    console.log('development mode')
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    console.log('production mode')
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://justright-shop.herokuapp.com") // test http://192.168.0.6:8080
    res.header('Access-Control-Allow-Credentials', false)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next()
  });
  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' })
    console.log("connectd")
  });
  

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
