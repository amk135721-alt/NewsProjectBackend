import mongoose from "mongoose";
const reportSchema=new mongoose.Schema({

    
    report:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newsusers",
    },
    newsId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"news",
    },
})
export default mongoose.model("report",reportSchema)