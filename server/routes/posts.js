const router = require(`express`).Router()
const { getFeedPosts, getUserPosts, likePost } = require("../controllers/posts")
const verifyToken = require("../middleware/auth")

router.get("/", verifyToken, getFeedPosts)
router.get("/:userId/posts", verifyToken, getUserPosts)

router.patch("/:id/like", verifyToken, likePost)

module.exports = router
