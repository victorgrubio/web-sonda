require('dotenv').config();
export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    script: [
      { src: '/js/canvasjs.min.js' }
    ],
    link: [
      { rel:'apple-touch-icon', sizes:'57x57', href:'/favicon/apple-icon-57x57.png'},
      { rel:'apple-touch-icon', sizes:'60x60', href:'/favicon/apple-icon-60x60.png'},
      { rel:'apple-touch-icon', sizes:'72x72', href:'/favicon/apple-icon-72x72.png'},
      { rel:'apple-touch-icon', sizes:'76x76', href:'/favicon/apple-icon-76x76.png'},
      { rel:'apple-touch-icon', sizes:'114x114', href:'/favicon/apple-icon-114x114.png'},
      { rel:'apple-touch-icon', sizes:'120x120', href:'/favicon/apple-icon-120x120.png'},
      { rel:'apple-touch-icon', sizes:'144x144', href:'/favicon/apple-icon-144x144.png'},
      { rel:'apple-touch-icon', sizes:'152x152', href:'/favicon/apple-icon-152x152.png'},
      { rel:'apple-touch-icon', sizes:'180x180', href:'/favicon/apple-icon-180x180.png'},
      { rel:'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
      { rel:'icon', type: 'image/png', sizes:'192x192',  href:'/favicon/android-icon-192x192.png'},
      { rel:'icon', type: 'image/png', sizes:'32x32', href:'/favicon/favicon-32x32.png'},
      { rel:'icon', type: 'image/png', sizes:'96x96', href:'/favicon/favicon-96x96.png'},
      { rel:'icon', type: 'image/png', sizes:'16x16', href:'/favicon/favicon-16x16.png'},
      { rel:'manifest', href:'/favicon/manifest.json'},
      { rel: "stylesheet", href: "https://unpkg.com/element-ui/lib/theme-chalk/index.css"},
      { rel: "stylesheet", href: "/css/bootstrap.min.css" },
      { rel: "stylesheet", href: "/css/bootstrap-extend.css" },
      { rel: "stylesheet", href: "/css/metismenu.min.css" },
      { rel: "stylesheet", href: "/css/icons.css" },
      { rel: "stylesheet", href: "/css/style.css" }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  // loading: { display: none },
  /*
   ** Global CSS
   */
  css: [ ],

  /*
  ** Add element-ui in our app, see plugins/element-ui.js file
  */
  plugins: [
    '@/plugins/element-ui',
    { src: '~/plugins/vue-timers', mode: 'client' },
    { src: '~/plugins/vue-picture-input', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    'nuxt-element-ui',
    // Doc: https://bootstrap-vue.js.org
    // 'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/toast',    
    '@nuxtjs/auth',
    '@nuxtjs/moment',
    '@nuxtjs/dotenv'
  ],
  
  loading: false,

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'http://localhost:3000/api/login',
            method: 'post',
            propertyName: false
          },
          logout: {
            url: 'http://localhost:3000/api/logout',
            method: 'post',
            propertyName: false
          },
          user: { 
            url: 'http://localhost:3000/api/user', 
            method: 'get', 
            propertyName: false 
          }
        },
        tokenRequired: false,
        tokenType: false
      }
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  
  // axios: {
  //   // baseURL: 'http://sonda:5001/videoAnalysis/'
  //   // baseURL: 'http://localhost:5001'
  //   baseURL: process.env.MY_API_URL
  //   // baseURL: 'http://192.168.0.59:5001/videoAnalysis'
  // },

  serverMiddleware: [
    { path: '/api', handler: '~/api/index.js' },
  ],

  toast: {
    position: 'top-right',
    duration: 2000
  },  
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all'
      }
    },          
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }      
    }
  }
}
