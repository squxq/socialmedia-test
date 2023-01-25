const router = require(`express`).Router()
const {
  getUser,
  getUserFriends,
  addRemoveFriend,
} = require("../controllers/user.js")
const verifyToken = require("../middleware/auth")

// read
router.get("/:id", verifyToken, getUser)
router.get("/:id/friends", verifyToken, getUserFriends)

// update
router.patch("/:id/:friendId", verifyToken, addRemoveFriend)

module.exports = router
