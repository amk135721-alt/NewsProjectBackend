import nodemailer from "nodemailer"; 
const transport=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"amk135721@gmail.com",
        pass:"sohv jvbj dflu oecv"
    }
})
export const sendemail=async(to,subject,text)=>{
try {
    transport.sendMail({
        from:"amk135721@gmail.com",
        to,
        subject,
        text,


    })
    console.log("Email sent Successfully")
} catch (error) {
    console.log(error.message)
}
}