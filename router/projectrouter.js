import express from "express"
import {  createNews,  deleteAllNews,  deleteNews,  editNews,  getAllNews, getNewsByLocation, getNewsByType, readMoreById } from "../controller/projectcontroller.js"
import { upload } from "../config/multer.js"


const router=express.Router()

router.post("/create-news",upload.single("pic"), createNews)
router.get("/getallnews",getAllNews)
router.get("/getbylocation/:location",getNewsByLocation)
router.get("/getbytype/:newstype",getNewsByType)
router.get("/readmore/:id",readMoreById)
router.delete("/deletenews/:id",deleteNews)
router.delete("/deleteallnews",deleteAllNews)
router.put('/edit',upload.single("pic"),editNews)
export default router

