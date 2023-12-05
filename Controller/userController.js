const users=require('../Model/userSchema')
const jwt=require('jsonwebtoken')
const nodemailer=require("nodemailer")
const email=process.env.email
const pass=process.env.pass


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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:"gcthostelgcthostel789@gmail.com",
    pass: "aivpikwikxkgqmyh"
  },
});
  
 exports.sendOtp = async (req,res) => {
    console.log("inside the otp mail");
  
      const {to,subject, html } = req.body;
     
    const mailOptions = {
      from: 'gcthostelgcthostel789@gmail.com',
      to,
      subject,
      html,
    };
    console.log(mailOptions);

  
    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json(info)
      console.log('Email sent: ' + info.response);
    } catch (error) {
        res.status(401).json('Error sending email:', error)
      console.error('Error sending email:', error);
    }
  };

//   change password
exports.changePassword=async(req,res)=>{
    console.log("inside change password function");
    const {email,password}=req.body
    try {
        const existingUser=await users.findOne({email})
        if (existingUser) {
            await users.findOneAndUpdate(
              { email },
              { $set: { password:password } },
              { new: true } 
            );
      
            console.log("Password updated successfully");
            res.status(200).json("Password updated successfully");
         }else{
            res.status(404).json("incorrect Email / Password")
         }

    } catch (error) {
        console.log(error);
        res.status(401).json(`password api failed : ${error}`)

    }
}