const admins=require('../Model/adminSchema')
const jwt=require('jsonwebtoken')

// exports.register=async(req,res)=>{
//     console.log("inside the admin register controller function");
//     const {email,password}=req.body
//     try {
//         const existingUser=await admins.findOne({email})
//         if(existingUser){
//             res.status(406).json("Account already exists !!!")
//         }else{
//             const newUser=new admins({
//                 email,password
//             })
//             await newUser.save()
//             res.status(200).json(newUser)
//         }
        
//     } catch (error) {
//         res.status(200).json(`Register Api failed, Error ${error}`)
//     }

// }
 exports.login=async(req,res)=>{
    console.log("inside Adminlogin function");
    const {email,password}=req.body
    console.log(req.body);
    try {
        const existingAdmin=await admins.findOne({email,password})
         if(existingAdmin){
            // console.log("inside function");
            const token=jwt.sign({adminId:existingAdmin._id},"supersecretkey12345")
            res.status(200).json({
                existingAdmin,token
            })
         }else{
            res.status(404).json("incorrect Email / Password")
         }

    } catch (error) {
        console.log(error);
        res.status(401).json(`login api failed : ${err}`)

    }
}