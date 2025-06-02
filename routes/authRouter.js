const { Router } = require("express")
const authController = require("../controllers/authController")
const authMiddleware = require('../middleware/authMiddleware')

const authRouter = Router();

authRouter.get("/sign-up", authMiddleware.redirectIfAuthenticated, authController.getSignUpForm)
authRouter.post("/sign-up", authMiddleware.redirectIfAuthenticated, authController.postSignUp)

authRouter.get("/login", authMiddleware.redirectIfAuthenticated, authController.getLoginForm)
authRouter.post("/login", authMiddleware.redirectIfAuthenticated, authController.postLogin)

authRouter.get("/logout", authMiddleware.ensureAuthenticated, authController.getLogout)

authRouter.get("/become-member", authMiddleware.ensureAuthenticated, authMiddleware.ensureNotMember, authController.getBecomeMemberForm)
authRouter.post("/become-member", authMiddleware.ensureAuthenticated, authController.postMember)

authRouter.get("/become-admin", authMiddleware.ensureAuthenticated, authMiddleware.ensureMember, authMiddleware.ensureNotAdmin, authController.getBecomeAdminForm)
authRouter.post("/become-admin", authMiddleware.ensureAuthenticated, authMiddleware.ensureMember, authMiddleware.ensureNotAdmin, authController.postBecomeAdmin)
// itemsRouter.get("/categories/:cat_id", categoriesController.getItemsByCategoryId)

module.exports = authRouter;