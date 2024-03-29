require("express-async-errors")
const AppError = require("./utils/AppError")
const uploadConfig = require("./configs/upload")
const migrationsRun = require("./database/sqlite/migrations")
const cors = require("cors")
const express = require("express")

migrationsRun()

const app = express()
app.use(express.json())
app.use(cors())
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

const PORT = 3333

const routes = require("./routes")

app.use(routes)

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    })
  }

  console.error(error)

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  })
})

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`))
