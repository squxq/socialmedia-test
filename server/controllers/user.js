const User = require("../models/User")

const getUser = (req, res) => {
  const { id } = req.params
  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        err: `Database search functionality failed. User could not be found. Please try again later.`,
      })
    } else if (!user) {
      return res.status(404).json({
        success: false,
        err: `User could not be found. Please try again later.`,
      })
    }
    const sendableUser = user.toObject()
    delete sendableUser.password
    return res.status(200).json({
      success: true,
      user: sendableUser,
    })
  })
}

const getUserFriends = (req, res) => {
  const { id } = req.params
  User.findById(id, async (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        err: `Database search functionality failed. User could not be found. Please try again later.`,
      })
    } else if (!user) {
      return res.status(404).json({
        success: false,
        err: `User could not be found. Please try again later.`,
      })
    }

    try {
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      )
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath }
        }
      )

      return res.status(200).json({
        success: true,
        friends: formattedFriends,
      })
    } catch (err) {
      return res.status(404).json({
        success: false,
        err: `Server could not find any friends. Please try again later.`,
      })
    }
  })
}

const addRemoveFriend = (req, res) => {
  const { id, friendId } = req.params
  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        err: `Database search functionality failed. User could not be found. Please try again later.`,
      })
    } else if (!user) {
      return res.status(404).json({
        success: false,
        err: `User could not be found. Please try again later.`,
      })
    }
    User.findById(friendId, async (err, friend) => {
      if (err) {
        return res.status(500).json({
          success: false,
          err: `Database search functionality failed. User could not be found. Please try again later.`,
        })
      } else if (!friend) {
        return res.status(404).json({
          success: false,
          err: `User could not be found. Please try again later.`,
        })
      }

      try {
        if (user.friends.includes(friendId)) {
          user.friends = user.friends.filter((id) => id !== friendId)
          friend.friends = friend.friends.filter((id) => id !== id)
        } else {
          user.friends.push(friendId)
          friend.friends.push(id)
        }

        await user.save()
        await friend.save()

        const friends = await Promise.all(
          user.friends.map((id) => User.findById(id))
        )
        const formattedFriends = friends.map(
          ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return {
              _id,
              firstName,
              lastName,
              occupation,
              location,
              picturePath,
            }
          }
        )

        return res.status(200).json({
          success: true,
          friends: formattedFriends,
        })
      } catch (err) {
        return res.status(501).json({
          success: false,
          err: `Friend list could not be modified. Please try again later.`,
        })
      }
    })
  })
}

module.exports = {
  getUser,
  getUserFriends,
  addRemoveFriend,
}
