// const LocalStrategy = require('passport-local').Strategy

// const bcrypt = require('bcrypt')

// function initialize(passport, getUserByEmail, getUesrById) {
//     const authenticateUser = async (email, password, done) => {
//         const user = getUserByEmail(email)
//         if (user == null) {
//             // no error, no users, and error message
//             return done(null, false, { message: 'No user with that email'})
//         }

//         try {
//             if (await bcrypt.compare(password, user.password)) {
//                 // authenticated user
//                 return done(null, user)
//             } else {
//                 // password did not match
//                 return done(null, false, { message: 'Password Incorrect'})
//             }
//         } catch(e) {
//             return done(e)
//         }
//     }
//     passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
//     passport.serializeUser((user, done) => done(null, user.id))
//     passport.deserializeUser((id, done) => {
//         return done(null, getUserById(id))
//     })
// }

// // export function
// module.exports = initialize 


const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize
