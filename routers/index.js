const express = require("express")
const router = express.Router()
const {isAuthorized} = require("../controllers/controller")
const userRoutes  = require("./user")
const homeRoutes  = require("./home")
const historyRoutes  = require("./history")

router.use("/", userRoutes)
router.use("/home", isAuthorized, homeRoutes)
router.use("/history", historyRoutes)

module.exports = router
