import admin from "../model/admin.js";
import projectmodel from "../model/projectmodel.js";
import bcrypt from "bcrypt"
import view from "../model/view.js";
import jwt from "jsonwebtoken"
import reportModel from "../model/reportModel.js"
import { client } from "../config/redis.js";
import { sendemail } from "../config/mail.js";
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        console.log(name, email, password)
          await client.del("newsusers")
        const checkUser = await projectmodel.findOne({ email })
        if (checkUser) {
            res.json({ success: false, message: "User already exist" })
        }
        const encrypass = await bcrypt.hash(password, 10)
        const storeUser = await projectmodel.create({ name, email, password: encrypass })
        if (!storeUser) {
            res.json({ success: false, message: "User not created" })
        }

        res.json({ success: true, message: "User Created successfully", data: storeUser })

    } catch (error) {
        res.json({ success: false, message: "error" })
    }

}


const SECRETE_KEY = "onlyforuser";

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkEmail = await projectmodel.findOne({ email });
        
        if (!checkEmail) {
            return res.json({ success: false, message: "User not registered" });
        }

        const comparepassword = await bcrypt.compare(password, checkEmail.password);
        if (!comparepassword) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
        
        if (checkEmail.status === "blocked") {
            return res.json({ success: false, message: "You are Blocked", data: checkEmail.status });
        }

        // Set token expiration duration here (e.g., "2m", "1h", "1d")
        const token = jwt.sign(
            { id: checkEmail._id }, 
            SECRETE_KEY, 
            { expiresIn: "1h" }
        );
        
        const subject="Login "
        const text="Thank You For login"
        await sendemail(checkEmail.email,subject,text)
        return res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const createReport = async (req, res) => {
    try {
        const { report,id } = req.body
        console.log(report)
        console.log(req.user)
        const storeReport = await reportModel.create({
            report,
            userId: req.user,
            newsId:id,
        })
        if (!storeReport) {
            res.json({ success: false, message: "Report not submitted" })
        }

        res.json({ success: true, message: "Successfully created", data: storeReport })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }

}



export const userDetail = async (req, res) => {
    try {
        // 1. Parse pagination parameters (default to page 1 if not provided)
        const page = Number(req.query.page)
        const limit = 8;
        const skip = (page - 1) * limit;

        const redisKey = `newsusers:page:${page}:limit:${limit}`;

        // 2. Check Redis cache
        const cachedUsers = await client.get(redisKey);

        if (cachedUsers) {
            return res.json({
                success: true,
                message: "--------USERS (CACHED FROM REDIS)-------",
                ...JSON.parse(cachedUsers)
            });
        }

        // 3. Query MongoDB with pagination & get total count
        const [users, totalUsers] = await Promise.all([
            projectmodel.find().skip(skip).limit(limit),
            projectmodel.countDocuments()
        ]);

        if (!users || users.length === 0) {
            return res.json({ success: false, message: "no data found" });
        }

        const responseData = {
            data: users,
            pagination: {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                limit
            }
        };

        // 4. Cache the paginated result in Redis (e.g., for 1 hour / 3600 seconds)
        await client.set(redisKey, JSON.stringify(responseData), {
            EX: 120
        });

        // 5. Send Response
        res.json({
            success: true,
            message: "--------USERS-------",
            ...responseData
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const BlockUser = async (req, res) => {
    try {
        const { userId } = req.params; // Matches /api/block/:userId

        // 1. Find user by ID
        const user = await projectmodel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Toggle status between "blocked" and "active"
        const newStatus = user.status === "blocked" ? "active" : "blocked";

        // 3. Update user status in database
        const updatedUser = await projectmodel.findByIdAndUpdate(
            userId,
            { status: newStatus },
            { new: true } // Returns updated document
        );

        return res.status(200).json({
            message: `User status changed to ${newStatus}`,
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};



export const getUserById = async (req, res) => {
    try {
        
        const id = req.user; 
        console.log(id)
        const find = await projectmodel.findById(id);
        if (!find) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ success: true, message: "--------USER-------", data: find });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

