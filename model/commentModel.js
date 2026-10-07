import mongoose from "mongoose";
const commentSchema= new mongoose.Schema({
comments:String,
postid:{ type:mongoose.Schema.Types.ObjectId,
        ref:"news",
},
userid:{
     type:mongoose.Schema.Types.ObjectId,
            ref:"newsusers",
}
})
export default mongoose.model("comment", commentSchema)