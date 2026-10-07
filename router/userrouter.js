import express from "express"

import { BlockUser, createReport, createUser, getUserById, userDetail, userLogin } from "../controller/usercontroller.js"
import {  authReport } from "../middleware/adminAuth.js"
import { validateUserRegister } from "../middleware/validater.js"
import { rateLimitation } from "../middleware/ratelimit.js"
const router =express.Router()

router.post("/create-user",validateUserRegister, createUser)
router.post("/userlogin",rateLimitation, userLogin)
router.get("/getalluser",userDetail)
router.post("/report",authReport,createReport)
router.put("/block/:userId",BlockUser)
router.post("/getbyuserid",authReport,getUserById)
export default router