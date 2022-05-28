const colors = require('vuetify/es5/util/colors').default
const session = require('express-session')
require('dotenv').config()

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: process.env.npm_package_name + '- 딱맞아쇼핑몰 ',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {src: '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'},
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    ['@nuxtjs/dotenv', { filename: `.env.${process.env.NODE_ENV}`, systemvars: true }]
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxyHeaders: false,
    credentials: true,
    method: "GET",
    url: `https://cors-anywhere.herokuapp.com/https://api.dropper.tech/covid19/status/korea?
    locale=${city}`,
    headers: {
    'APIKey': COVID_APIKEY,
    },
  },

  // proxy: {
  //   "/api/": {
  //       "target": "http://192.168.0.6:8080",
  //       "secure": false,
  //       "changeOrigin": true
  //   }
  // },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, { isDev }) {
      if (isDev && process.client ) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  // 서버 미들웨어 설정
  serverMiddleware: [
    session({
      secret: process.env.SESSION_SECRETKEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
      }
    }),

    // Will register file from project api directory to handle /api/* requires
    { path: '/api', handler: '~/api/index.js' },

  ],


}
