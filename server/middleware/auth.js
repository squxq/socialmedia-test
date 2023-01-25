const jwt = require(`jsonwebtoken`)

const verifyToken = (req, res, next) => {
  try {
    let token = req.header("Authorization")
    if (!token) {
      return res.status(403).json({
        success: false,
        err: `Authorization failed. Token is required. Please try again later.`,
      })
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft()
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(501).json({
          success: false,
          err: `Server couldn't verify the request token. User cannot be authorized. Please try again later.`,
        })
      }

      req.user = decodedToken
      next()
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      err: `Server is not responding accordingly. Error: ${err.message}. Please try again later.`,
    })
  }
}

module.exports = verifyToken
