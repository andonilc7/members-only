const express = require('express');
const pg = require('pg');
const session = require('express-session');
const passport = require('passport');
const path = require("node:path");
const authRouter = require("./routes/authRouter")
const messageRouter = require("./routes/messageRouter")
const pool = require("./db/pool")
const pgStore = require("connect-pg-simple")(session)
const flash = require("connect-flash")
const authMiddleware = require("./middleware/authMiddleware")
const methodOverride = require("method-override")
// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');
const app = express()



app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath))
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))

const sessionStore = new pgStore({
  pool: pool
})
app.use(session({ secret: "cats", resave: false, saveUninitialized: false, store: sessionStore, cookie: { maxAge: 1000*60*60*24 } }));
app.use(passport.session());
app.use(flash())
// doing flash errors separate from the validation errors, for example
app.use((req, res, next) => {
  res.locals.flashErrors = req.flash("error")
  next()
})
// setting the current user so i can dynamically make adjustments in ejs (e.g. having login/signup button vs "Welcome [first name]!"
// also can use this for the messages so that i know that i can show the creator of a message and the time created if a user is logged in
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // console.log(req.user)
  next()
})

app.use(authMiddleware.preventCache)


app.use("/", authRouter)
app.use("/", messageRouter)




app.listen(3000)