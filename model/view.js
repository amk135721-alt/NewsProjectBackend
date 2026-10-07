import mongoose from "mongoose";
const projectSchema3 = new mongoose.Schema({
    pic: String,
    newstype: String,
    newsheadline: String,
    newscontent: String,
    location: String,


})
export default mongoose.model("news", projectSchema3)
