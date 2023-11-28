const mongoose=require('mongoose')
const validator=require('validator')
const userScheme=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:[3,'Must be at least 3,got{VALUE}']
    },
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

const users=mongoose.model("users",userScheme)
module.exports=users