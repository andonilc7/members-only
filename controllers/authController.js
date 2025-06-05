const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const db = require("../db/queries")
const passport = require("passport")
require("dotenv").config()

function getSignUpForm(req, res) {
  res.render("sign-up-form")
}

// naming this handler bc this is the route handler (last function in the chain)
async function postSignUpHandler(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("sign-up-form", {
      oldInput: req.body,
      // "errors" is for express validation errors, so general form errors
      // so i use this for signing up, but can also use for the create new message form 
      // by using express validator (server side validation)
      errors: errors.array()
    })
  }
  const {fname, lname, username, password, confirmPassword} = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  // Bobiscool123
  await db.addUser(username, fname, lname, hashedPassword, false)
  
  // await db.addUser()
  res.redirect("/login")
}

function getLoginForm(req, res) {
  res.render("login")
}

// example: 
// {"fname":"bob","lname":"jones","username":"oiwne@in",
// "password":"on","confirm-password":"oisf"}
// naming this postSignUp bc this is the overall function we are passing to router,
// with the validation AND the route handler at end of chain
const postSignUp = [
body("fname").trim().notEmpty().withMessage("First Name cannot be empty").isAlpha().withMessage("First name must only contain letters."),
body("lname").trim().notEmpty().withMessage("Last Name cannot be empty").isAlpha().withMessage("Last name must only contain letters."),
body("username").trim().notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Username must have an email format"),
body("password").trim().notEmpty().withMessage("Password cannot be empty."),
body("confirmPassword").trim().notEmpty().withMessage("Confirm Password cannot be empty.").custom((value, { req }) => {
  return value === req.body.password
}).withMessage("Confirm Password must match Password"),
postSignUpHandler
]

function postLogin(req, res, next) { 
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    // failureFlash errors used when passport.authenticate is used! 
    failureFlash: true
  })(req, res, next)
}

function getLogout(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
});
}

function getBecomeMemberForm(req, res) {
  res.render("become-member-form")
}

async function postMemberHandler(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("become-member-form", {
      errors: errors.array()
    })
  }
  await db.updateMembershipStatusToTrue(req.user.id)
  res.redirect("/")
}

const postMember = [
  body("passcode").trim().notEmpty().withMessage("Enter the secret passcode.").equals(process.env.SECRET_PASSCODE).withMessage("Incorrect passcode."),
  postMemberHandler
]

function getBecomeAdminForm(req, res) {
  res.render("become-admin-form")
}

async function postBecomeAdminHandler(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("become-admin-form", {
      errors: errors.array()
    })
  }
  await db.updateAdminStatusToTrue(req.user.id)
  res.redirect("/")
}

const postBecomeAdmin = [
  body("passcode").trim().notEmpty().withMessage("Enter the secret passcode.").equals(process.env.SECRET_ADMIN_PASSCODE).withMessage("Incorrect passcode."),
  postBecomeAdminHandler
]

module.exports = {
  getSignUpForm,
  postSignUp,
  getLoginForm,
  postLogin,
  getLogout,
  getBecomeMemberForm,
  postMember,
  getBecomeAdminForm,
  postBecomeAdmin
}