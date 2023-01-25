const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// register user
const register = (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    picturePath,
    friends,
    location,
    occupation,
  } = req.body

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return res.status(500).json({
        success: false,
        err: `Salt was not created. Password can not be encrypted. Please try again later.`,
      })
    }
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({
          success: false,
          err: `Password was not encrypted. Please try again later.`,
        })
      }
      User.create(
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          picturePath,
          friends,
          location,
          occupation,
          viewedProfile: Math.floor(Math.random() * 10000),
          impressions: Math.floor(Math.random() * 10000),
        },
        (err, user) => {
          if (err) {
            return res.status(501).json({
              success: false,
              err: `User has not been created. Please try again later.`,
            })
          }
          const sendableUser = user.toObject()
          delete sendableUser.password
          return res.status(201).json({
            success: true,
            user: sendableUser,
          })
        }
      )
    })
  })
}

// logging in
const login = (req, res) => {
  const { email, password } = req.body
  User.find({ email }, (err, { 0: user }) => {
    if (err) {
      return res.status(500).json({
        success: false,
        err: `Search functionality in database failed. Please try again later.`,
      })
    } else if (!user) {
      return res.status(404).json({
        success: false,
        err: `User not found. Please retry with different credentials.`,
      })
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          err: `The server could not verify the password. User cannot be logged in. Please try again later.`,
        })
      } else if (!result) {
        return res.status(404).json({
          success: false,
          err: `Invalid credentials. Please type valid credentials.`,
        })
      }

      jwt.sign({ id: user._id }, process.env.JWT_SECRET, (err, token) => {
        if (err) {
          return res.status(501).json({
            success: false,
            err: `Jwt token was not created. User cannot be logged in. Please try again later.`,
          })
        }

        const sendableUser = user.toObject()
        delete sendableUser.password
        return res.status(200).json({
          success: true,
          user: sendableUser,
        })
      })
    })
  })
}

module.exports = { register, login }
