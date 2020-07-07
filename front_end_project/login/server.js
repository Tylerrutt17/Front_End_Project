// if (process.env.NODE.ENV !== 'production') {
//     // Load in all enviroment variables and set them
//     require('dotenv').config()
// }

// const express = require('express')
// const app = express()
// const bcrypt = require('bcrypt')
// const passport = require('passport')
// const flash = require('express-flash')
// const session = require('express-session')
// const methodOverride = require('method-override')


// const initializePassport = require('./passport-config')

// initializePassport(
//     passport, 
//     email => users.find(user => user.email === email),
//     id => users.find(user => user.id === id)
// )

// const users = []

// console.log("users: "+users)

// // View engine is set to ejs now I can use it
// app.set('view-engine', 'ejs')

// // Basically just telling the server that I want to be able to access
// // The form variables inside of the request variable inside the post method // Way of capturing variables
// app.use(express.urlencoded({ extended: false}))
// app.use(flash())
// app.use(session({
//     // Key that is kept secret that is going to encrypt all of the information
//     secret: process.env.SESSION_SECRET,
//     // disable resaving of session variables if nothings changed
//     resave: false,
//     // Used to save an empty value in the session if there is no value
//     saveUninitialized: false
// }))

// app.use(passport.initialize())
// app.use(passport.session())
// app.use(methodOverride('_method'))

// app.get('/', checkAuthenticated, (req, res) => {
//     res.render('index.ejs', { name: req.user.name})
// })

// // Can't go to the login page if not authenticated
// app.get('/login', checkNotAuthenticated, (req, res) => {
//     res.render('login.ejs')
// })

// app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//     // where does it go when there is a success
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
// }))

// app.get('/register', checkAuthenticated, (req, res) => {
//     res.render('register.ejs')
// })

// app.post('/register', checkAuthenticated, (req, res) => {
//     // Name is used in the initiation of fields in each view, ID of sorts
//     req.body.email

//     try {
//     const hashedPassword = bcrypt.hash(req.body.password, 10)
//     users.push ({
//         id: Date.now().toString(),
//         name: req.body.name,
//         email: req.body.email,
//         password: hashedPassword
//     })
//     res.redirect('/login')
//     } catch {
//     // reloads the page
//     res.redirect('/register')
//     }
//     console.log(users)
// })

// app.delete('/logout'), (req, res) => {
//     req.logOut()
//     req.redirect('/login')
// }

// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next()
//     }
//     res.redirect('/login')
// }

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//       return res.redirect('/')
//     }
//     next()
//   }
// app.listen(3000)


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  const users = []
  
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  
  // Static Files
  app.use(express.static(__dirname + 'public'));
  app.use(express.static(__dirname + '/public'));
  
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
  })
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
  app.listen(3000)