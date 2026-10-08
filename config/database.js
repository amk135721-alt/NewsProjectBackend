import mongoose from "mongoose"

export const connectdb = () =>{
    try {
        mongoose.connect("mongodb+srv://amk135721:BSjoFffvmFeTlwRr@cluster0.w9buwnj.mongodb.net/?appName=Cluster0")
        console.log("mongodb connected")
    } catch (error) {
        console.log(error.message)
    }
}

