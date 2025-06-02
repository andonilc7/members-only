const { Router } = require("express")
const messageController = require("../controllers/messageController")
const authMiddleware = require('../middleware/authMiddleware')

const messageRouter = Router()

messageRouter.get("/", messageController.getAllMessagesAndAuthors)
messageRouter.get("/new", authMiddleware.ensureAuthenticated, messageController.getNewMessageForm)
messageRouter.post("/new", authMiddleware.ensureAuthenticated, messageController.postNewMessage)
messageRouter.delete("/:msg_id", authMiddleware.ensureAuthenticated, authMiddleware.ensureMember, authMiddleware.ensureAdmin, messageController.deleteMessage)

module.exports = messageRouter