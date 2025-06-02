const db = require("../db/queries")
const { body, validationResult } = require("express-validator")

async function getAllMessagesAndAuthors(req, res) {
  const messages = await db.getAllMessagesAndAuthors()
  res.render('messages', {messages: messages})
}

function getNewMessageForm(req, res) {
  res.render("newMessageForm")
}


// route handler (goes at end of chain in postNewMessage, after all of the express-validator stuff)
async function postNewMessageRouteHandler(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("newMessageForm", {
      oldInput: req.body,
      // "errors" (rather than "flashErrors") is for express-validator errors
      errors: errors.array()
    })
  }
  const {title, message} = req.body;
  // console.log(title)
  // console.log(message)
  // console.log(req.user)
  await db.addMessage(title, message, req.user.id)
  res.redirect("/")
}

// the "function" (array of functions) being passed to router
// req.body example: { title: 'iauegoawebrg', message: 'sobgsopfg' }
const postNewMessage = [
  body("title").trim().notEmpty().withMessage("Title cannot be empty"),
  body("message").trim().notEmpty().withMessage("Message cannot be empty."),
  postNewMessageRouteHandler
]

async function deleteMessage(req, res) {
  const msg_id = req.params.msg_id
  await db.deleteMessage(msg_id)
  res.redirect("/")
}

module.exports = {
  getAllMessagesAndAuthors,
  getNewMessageForm,
  postNewMessage,
  deleteMessage
}