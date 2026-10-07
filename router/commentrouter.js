import express from "express";
import { authReport } from "../middleware/adminAuth.js";
import { createComment, getallCommentById } from "../controller/commentController.js";

const router=express.Router()
router.post("/create-comment",authReport,createComment)
router.get("/viewcomment/:postid",getallCommentById)
export default router