import mongoose from "mongoose";

const projectSchema2 = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  
  },
  email: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["unblocked", "blocked"],
    default: "unblocked",
  },
}, { timestamps: true });

export default mongoose.model("newsusers", projectSchema2);