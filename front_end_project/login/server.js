if (process.env.NODE_ENV !== 'production') {
  // Load in all enviroment variables and set them
    require('dotenv').config()
}
  
  const express = require('express')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  const pgp = require('pg-promise')() // Sql
  var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

  const LocalStrategy = require('passport-local').Strategy

  // Connection to Elephant SQL database   // Pg proimse
  
  //const initializePassport = require('./passport-config')

  // Connection to Elephant SQL database   // Pg proimse
  const database = pgp('postgres://refrxuce:ROqL7x5m8aoDKNG5BewWMJ2sJWSOJcru@ruby.db.elephantsql.com:5432/refrxuce')

  initialize(
    passport,
    email => currentUser[0], //users.find(user => user.email === email),
    id => currentUser[0],//users.find(user => user.id === id)
    name => currentUser[0]
  )
  
  const currentUser = []

  // View engine is set to ejs now I can use it
  app.set('view-engine', 'ejs')

  // Basically just telling the server that I want to be able to access
  // The form variables inside of the request variable inside the post method // Way of capturing variables
  //app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  
  // Static Files
  app.use(express.static(__dirname + 'public'));
  app.use(express.static(__dirname + '/public'));
  
  app.use(session({
    // Key that is kept secret that is going to encrypt all of the information
    secret: 'keyboard cat',
    // disable resaving of session variables if nothings changed
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name, id: req.user.id })
  })
  
  // Can't go to the login page if not authenticated
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })

  app.get('/faq', (req, res) => {
    res.render('faq.ejs')
  })

  app.post('/login', checkNotAuthenticated, addUser, passport.authenticate('local',{
    // where does it go when there is a success
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  function addUser(req, res, next) {
    database.one(`SELECT * FROM front_users WHERE email='${req.body.email}'`)
    .then(user=> {
        // Add user to users array
        currentUser.push(user)
        //res.locals.user = user
        next()
      })
      .catch(err=>console.log("There was an error", err))
  }

  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    // Name is used in the initiation of fields in each view, ID of sorts
    try {
      // req.body.password is the password field value
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      
      // Inserts user into the database
      database.none(`INSERT INTO front_users (name, email, password) VALUES ('${req.body.name}', '${req.body.email}', '${hashedPassword}')`)
      .then(()=>{
        database.any("SELECT * FROM front_users").then(students=>console.log(students))
          res.redirect('/login')
      })

    } catch {
      console.log("error adding")
      res.redirect('/register')
    }
  })
  
  app.delete('/logout', (req, res) => {
    req.logOut()
    currentUser.length = 0
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
  
  function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {

      // Process of initializing a new user
      database.one(`SELECT * FROM front_users WHERE email='${email}'`)
      .then((student)=> {
         console.log(student.password + " " + password)
  
          var user = {
              name: student.name,
              email: student.email,
              password: student.password,
              id: student.id
          }
  
          bcrypt.compare(password,student.password,(err,isMatch)=>{
            if(err)throw err;
              if (isMatch === true) {
                console.log("Correct PASSWORD! "+ user.name)
                currentUser.push(user)
                return done(null, user)
              } else {
                console.log("Wrong Passcode")
                return done(null, false, { message: 'Password incorrect' })
              }
          })
        .catch(err=>console.log('help'))
         })
    }
  
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
      return done(null, getUserById(id))
    })
  }

  app.listen(8000)

  module.exports = database