import mongoose from "mongoose";
const projectSchema4 = new mongoose.Schema({
    pic: String,
    newsheadline: String,
    location: String,


})
export default mongoose.model("highlight", projectSchema4)
