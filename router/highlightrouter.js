import express from "express";
import { createHighlight, deleteAllHighlight, deleteHighlight, getAllHighlight, getOneHighlight } from "../controller/highlightcontroller.js";
import { highlight } from "../config/highlightmulter.js";
import { upload } from "../config/multer.js";
const router=express.Router();
router.post("/create-highlight",upload.single("pic"), createHighlight)
router.get("/highlights",getAllHighlight)
router.get("/onehighlight",getOneHighlight)
router.delete("/deletehighlight/:id",deleteHighlight)
router.delete("/deleteallhighlight",deleteAllHighlight)
export default router