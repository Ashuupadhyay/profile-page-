const mongoose =require("mongoose");
const userschema=mongoose.Schema;
    const schema=new userschema({
        usercollectionid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
           profiledp:{
          type:String,
            default:"defaultdp.png"
           }
        



    })


const mongodpcollection=mongoose.model("userdp",schema);
module.exports=mongodpcollection;
