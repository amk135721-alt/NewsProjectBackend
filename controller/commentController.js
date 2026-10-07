import commentModel from "../model/commentModel.js";

export const createComment = async (req, res) => {
    try {
           const userid=req.user
           const {comments,postid}=req.body
           const storeComment = await commentModel.create({ comments,postid,userid })
           if (!storeComment) {
            res.json({ success: false, message: "Not uploaded" })
        }
        console.log(storeComment)
        res.json({ success: true, message: "Comment Uploaded" })       
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getallCommentById =async (req,res) => {
    try {
         const postid=req.params.postid
         console.log(postid)
         const find = await commentModel.find({postid}).populate("userid","name")
                if (!find) {
                    res.json({ success: false, message: "no data found" })
                }
                res.json({ success: true, message: "--------COMMENTS-------", data: find })
        
    } catch (error) {
          res.json({ success: false, message: error.message })
    }
    
}