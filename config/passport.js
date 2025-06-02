const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const db = require("../db/queries")
const bcrypt = require("bcryptjs")

async function verifyCallback(username, password, done) {
  try {
    const user = await db.getUserByUsername(username);
    if (!user) {
      return done(null, false, { message : "Incorrect username"})
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return done(null, false, { message: "Incorrect password"})
    }

    return done(null, user)


  } catch(err) {
    return done(err)
  }
}

const strategy = new LocalStrategy(verifyCallback)

passport.use(strategy)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
  const user = await db.getUserById(id)
  done(null, user)
  } catch(err) {
    done(err)
  }
})