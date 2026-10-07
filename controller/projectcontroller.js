import admin from "../model/admin.js";
import projectmodel from "../model/projectmodel.js";
import bcrypt from "bcrypt"
import view from "../model/view.js";
import jwt from "jsonwebtoken"
import { client } from "../config/redis.js";

export const createNews = async (req, res) => {
    try {
        const pic = req.file.filename
        const { newstype, newsheadline, newscontent, location
        } = req.body
        console.log(req.user)
        const storeNews = await view.create({ pic, newstype, newsheadline, newscontent, location })
        if (!storeNews) {
            res.json({ success: false, message: "User not created" })
        }
        console.log(storeNews)
        await client.del("news")
        res.json({ success: true, message: "News Uploaded" ,data:storeNews})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
export const getAllNews = async (req, res) => {
    try {
           await client.del("news")
        // 1. Extract parameters from req.query (with fallbacks)
        const page = Number(req.query.page)
        const limit = Number(req.query.limit)
        const skip = (page - 1) * limit;

        // Dynamic Redis key per page and limit
        const redisKey = `news:page:${page}:limit:${limit}`;

        const redisNews = await client.get(redisKey);
        if (redisNews) {
            return res.json({
                success: true,
                message: "GETTING FROM REDIS",
                data: JSON.parse(redisNews)
            });
        }
        // 3. Fetch data and total count concurrently from MongoDB
        const [news, totalCount] = await Promise.all([
            view.find().skip(skip).limit(limit).lean(),
            view.countDocuments()
        ]);
        const totalPages = Math.ceil(totalCount / limit);

        const responseData = {
            success: true,
            message: "--------NEWS-------",
            news,
            totalCount,
            totalPages,
            currentPage: page,
        };
        // 4. Store in Redis with an Expiration Time (e.g., 60 seconds)
        await client.set(redisKey, JSON.stringify(news), {
            EX: 10
        });
        return res.json(responseData);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};





export const getNewsByLocation = async (req, res) => {
    try {
        const location = req.params.location
        const find = await view.find({ location })
        if (!location) {
            res.json({ success: false, message: "Location not found" })

        }
        if (!find) {
            res.json({ success: false, message: "No data news found" })

        }
        res.json({ success: true, message: "------NEWS BY LOCATION------", data: find })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

export const getNewsByType = async (req, res) => {
    try {
        const newstype = req.params.newstype
        const find = await view.find({ newstype })
        if (!newstype) {
            res.json({ success: false, message: "News type not found" })

        }
        if (!find) {
            res.json({ success: false, message: "No data news found" })

        }
        res.json({ success: true, message: "------NEWS BY TYPE------", data: find })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}


export const readMoreById = async (req, res) => {
    try {
        const id = req.params.id
        const find = await view.findById(id)
        res.json({ success: true, message: "News Found", data: find })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const deletednws = await view.findByIdAndDelete(id);
        await client.del("news")
        if (!deletednws) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'News deleted successfully',
            data: deletednws
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting news',
            error: error.message
        });
    }
};


export const deleteAllNews = async (req, res) => {
    try {
        const dltdata = await view.deleteMany()
        if (!dltdata) {
            res.json({
                success: false,
                message: 'Highlight not found'
            });
        }
        await client.del("news")
        res.json({
            success: true,
            message: 'Highlights deleted successfully',
            data: dltdata
        });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const editNews = async (req, res) => {
    try {
        const { id, newstype, newsheadline, newscontent, location } = req.body;

        // Build update object
        const updateData = { newstype, newsheadline, newscontent, location };

        // Only update image if a new file was uploaded
        if (req.file) {
            updateData.pic = req.file.filename;
        }

        // Update document by ID using $set
        const storeNews = await view.updateOne(
            { _id: id },
            { $set: updateData }
        );

        if (storeNews.matchedCount === 0 || storeNews.nModified === 0) {
            return res.json({ success: false, message: "News article not found or no changes made" });
        }

        // Invalidate Redis cache
        await client.del("news");

        res.json({ success: true, message: "News Updated Successfully",data:storeNews });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
