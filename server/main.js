const express = require(`express`)
const bodyParser = require(`body-parser`)
const mongoose = require(`mongoose`)
const cors = require(`cors`)
const dotenv = require(`dotenv`)
const multer = require(`multer`)
const helmet = require(`helmet`)
const morgan = require(`morgan`)
const path = require(`path`)
const { fileURLToPath } = require(`url`)
const authRoutes = require(`./routes/auth`)
const userRoutes = require(`./routes/user`)
// const postRoutes = require(`./routes/post`)
const { register } = require("./controllers/auth")

// configuration
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "/public.assets")))

// file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/public/assets")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

// routes with files
app.post("/auth/register", upload.single("picture"), register)

// routes
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
// app.use("/posts", postRoutes)

// mongoose setup
const port = process.env.PORT || 9000
mongoose.set("strictQuery", false)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () =>
      console.log(`Server is connected to db and listening on port ${port}...`)
    )
  })
  .catch((err) =>
    console.log(
      `Something went wrong, the server is not connected to the db... \n Error Message: ${err.message} \n Error: ${err}`
    )
  )
