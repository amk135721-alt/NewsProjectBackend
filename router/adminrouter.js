import express from "express"
import { adminLogin, createAdmin, viewReport } from "../controller/admincontroller.js"
import { authReport } from "../middleware/adminAuth.js"

const router=express.Router()
router.post("/create-admin",createAdmin)
router.post("/adminlogin",adminLogin)
router.get("/viewreport",viewReport)
export default router
