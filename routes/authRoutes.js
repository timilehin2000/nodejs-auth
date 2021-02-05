const router = require("express").Router();
const authController = require("../controllers/authController");
const verify = require("../middlewares/verifyToken");

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/post").get(verify, authController.post);

module.exports = router;
