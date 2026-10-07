import mongoose from "mongoose";
const projectSchema1= new mongoose.Schema({
name:String,
email:String,
password:String,

})
export default mongoose.model("admin", projectSchema1)