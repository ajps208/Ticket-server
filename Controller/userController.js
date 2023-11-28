const users=require('../Model/userSchema')
const jwt=require('jsonwebtoken')


exports.register=async(req,res)=>{
    console.log("inside the register controller function");
    const {username,email,password}=req.body
    try {
        const existingUser=await users.findOne({email})
        if(existingUser){
            res.status(406).json("Account already exists !!!")
        }else{
            const newUser=new users({
                username,email,password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
        
    } catch (error) {
        res.status(200).json(`Register Api failed, Error ${err}`)
    }

}

exports.login=async(req,res)=>{
    console.log("inside login function");
    const {email,password}=req.body
    try {
        const existingUser=await users.findOne({email,password})
         if(existingUser){
            const token=jwt.sign({userId:existingUser._id},"supersecretkey12345")
            res.status(200).json({
                existingUser,token
            })
         }else{
            res.status(404).json("incorrect Email / Password")
         }

    } catch (error) {
        res.status(401).json(`login api failed : ${err}`)

    }
}