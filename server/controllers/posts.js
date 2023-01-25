const Post = require("../models/Post")
const User = require("../models/User")
const mongoose = require("mongoose")

const createPost = (req, res) => {
  const { userId, description, picturePath } = req.body
  User.findById(userId, (err, user) => {
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

    Post.create(
      {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        likes: {},
        comments: [],
      },
      (err, post) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: `Database create functionality failed. Post could not be created. Please try again later.`,
          })
        }

        Post.find({}, (err, posts) => {
          if (err) {
            return res.status(500).json({
              success: false,
              err: `Database search functionality failed. Posts could not be found. Please try again later.`,
            })
          } else if (posts.length === 0) {
            return res.status(404).json({
              success: false,
              err: `No posts found. Create a post, or come back later, maybe there will be new posts!!`,
            })
          }

          return res.status(201).json({
            success: true,
            posts,
          })
        })
      }
    )
  })
}

const getFeedPosts = (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      return res.status(500).json({
        success: false,
        err: `Database search functionality failed. Posts could not be found. Please try again later.`,
      })
    } else if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        err: `No posts found. Create a post, or come back later, maybe there will be new posts!!`,
      })
    }

    return res.status(201).json({
      success: true,
      posts,
    })
  })
}

const getUserPosts = (req, res) => {
  const { userId } = req.params
  Post.find({ userId }, (err, posts) => {
    if (err) {
      return res.status(500).json({
        success: false,
        err: `Database search functionality failed. Posts could not be found. Please try again later.`,
      })
    } else if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        err: `No posts found. Create a post, or come back later, maybe there will be new posts!!`,
      })
    }

    return res.status(201).json({
      success: true,
      posts,
    })
  })
}

const likePost = (req, res) => {
  const { id } = req.params
  const { userId } = req.body
  Post.findById(id, (err, post) => {
    if (err) {
      return res.status(500).json({
        success: false,
        err: `Database search functionality failed. Posts could not be found. Please try again later.`,
      })
    } else if (!post) {
      return res.status(404).json({
        success: false,
        err: `No post found. Create a post, or come back later, maybe there will be new posts!!`,
      })
    }

    const isLiked = post.likes.get(userId)
    if (isLiked) {
      post.likes.delete(userId)
    } else {
      post.likes.set(userId, true)
    }

    Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true },
      (err, post) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err: `Database search functionality failed. Posts could not be found. Please try again later.`,
          })
        }

        return res.status(200).json({
          success: true,
          post,
        })
      }
    )
  })
}

module.exports = {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
}
