import { client } from "../config/redis.js"
import highlightmodel from "../model/highlightmodel.js"




export const createHighlight = async (req, res) => {
    try {
           const  pic = req.file.filename
        const {  newsheadline, location
        } = req.body

        console.log(req.user)

        const storeHighlight = await highlightmodel.create({ pic,newsheadline, location })
        if (!storeHighlight) {
            res.json({ success: false, message: "Highlight not created" })
        }
        console.log(storeHighlight)
   
        res.json({ success: true, message: "Highlight Uploaded" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}


export const getAllHighlight = async (req, res) => {
    try {
        
        const find = await highlightmodel.find()
        if (!find) {
            res.json({ success: false, message: "no data found" })
        }
        res.json({ success: true, message: "--------HIGHLIGHTS-------", data: find })
    } catch (error) {
        res.json({ success: false, message: error.message })


    }
}



export const getOneHighlight = async (req, res) => {
    try {
        
        const find = await highlightmodel.find()
        const len=find.length
        if (!find) {
            res.json({ success: false, message: "no data found" })
        }
        res.json({ success: true, message: "--------HIGHLIGHTS-------", data: find[len-1]})
    } catch (error) {
        res.json({ success: false, message: error.message })


    }
} 









export const deleteHighlight = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedHighlight = await highlightmodel.findByIdAndDelete(id);
    if (!deletedHighlight) {
      res.json({
        success: false,
        message: 'Highlight not found'
      });
    }
     res.json({
      success: true,
      message: 'Highlight deleted successfully',
      data: deletedHighlight
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting highlight',
      error: error.message
    });
  }
};

export const deleteAllHighlight=async (req,res) => {
    try {
        const alldata=await highlightmodel.deleteMany();
           if (!alldata) {
      res.json({
        success: false,
        message: 'Highlight not found'
      });
    }
     res.json({
      success: true,
      message: 'Highlights deleted successfully',
      data: alldata
    });
    } catch (error) {
          res.json({success:false,message:error.message})      
    }
}

