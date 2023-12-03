const mongoose=require('mongoose')
const validator=require('validator')
const adminScheme=new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid error")
            }
        }
    },
    password:{
        type:String,
        required:true
    }

})

const admins=mongoose.model("admins",adminScheme)
module.exports=admins