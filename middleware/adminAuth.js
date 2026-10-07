import jwt from "jsonwebtoken"

 const SECRETE_KEY="onlyforuser"

 export const authReport=(req,res,next)=>{
    const token= req.header("token")
    console.log(token)
    if(!token){
        res.send("Token not found")
    }
    try {
        console.log(token,"token")
        const userid=jwt.verify(token,SECRETE_KEY)
        console.log(userid,"userid")
        req.user=userid.id;
        next();
    } catch (error) {
        console.log(error,"Error In Token ")
        res.send("Token does not match")
    }
 }

