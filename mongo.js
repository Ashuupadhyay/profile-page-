const mongoose =require("mongoose");


    mongoose.connect("mongodb://127.0.0.1:27017/chatapp");
    const userschema=mongoose.Schema;
    const schema=new userschema({
           username:String,
           email:String,
           password:String,
         dpcollectionid:{
             type:mongoose.Schema.Types.ObjectId,
             ref:"userdp"
               }
    })


const mongomodel=mongoose.model("user",schema);
module.exports=mongomodel;
