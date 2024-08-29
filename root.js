// require express
const express=require("express");
//call express function
const app=express();
//require http
const http=require("http").createServer(app);
//require socket
const io=require("socket.io")(http);
//pass express inctance in http
// pass server in socket
//export mongomodel
const mongomodel=require("./mongo")
//emport mongocollection dp
const mongodpcollection=require("./newmodeldp.js");
//export bcrypt
const bcrypt=require("bcrypt");
//export jwt(jsonwetoken)
const jwt=require("jsonwebtoken")
//cookies
const cookiparser=require("cookie-parser");
app.use(cookiparser());
// use middlewhere to serve static files

app.use(express.static(__dirname+"/public"));

// use middlewhere read data
app.use(express.json())
// use middlewhere read link url
  const eventemmiter=require("events");
  const emmiter=new eventemmiter();
  emmiter.setMaxListeners(50)
//set ejs
app.set("view engine", "views");
// use middlewhere read link url
app.use(express.urlencoded({extended:true}))
// export multer file
const upload=require("./multer.js");
// create home rout
app.get("/home",(req,res)=>{
    res.sendFile(__dirname+"/allhtmldoc/mainpage.html");
});
//redirect create account rout
app.get("/home/createaccount",(req,res)=>{
    res.sendFile(__dirname+"/allhtmldoc/create.html");
});
//login page if account exixts
app.get("/home/createaccount/login",(req,res)=>{
    res.render("login.ejs");
});
//save data in create rout with post api
 app.post("/home/createaccount",async(req,res)=>{
    let data=new mongomodel(req.body);
    //check register user exixts or not with email
     const findmail=await mongomodel.findOne({email:data.email});
     if(!findmail){
       //bcrypted password
     data.password=await bcrypt.hash(data.password,10)
        await data.save();
        //save user id(mongomodel) to dp collection
        const dpdata=new mongodpcollection({usercollectionid:data. _id});
        await dpdata.save();
              // save obj id(mongodpcollection)to user collection
            data.dpcollectionid=dpdata._id;
            await data.save();
  res.send("successfully registered please go back and login")
    
     }
     else{
         res.send("user already exists please go back and login");}
       
 });
 //post api login form
   app.post("/home/createaccount/login", async(req,res)=>{
    let data= new mongomodel(req.body);
    //check user with mail
    const checmail=await mongomodel.findOne({email:data.email})
    

   if(!checmail){res.send("user not find please register")}
    
  else{
        
      await bcrypt.compare(data.password,checmail.password,(er,hash)=>{
       if(er){res.send("somthing went error 404!")}
        else{
              if(hash==true){
                //send cookies and token

                const token=jwt.sign({username:checmail.username, email:checmail.email},"secratekey");
                res.cookie("token",token);
                
                res.redirect("/profile")
                
              }
              else{res.send("wrong password"); }
            }
   });
   
} 
});



//if user forgot passwordd
app.get("/home/createaccount/login/forgetpassword",isLoggedIn,(req,res)=>{
    res.sendFile(__dirname+"/allhtmldoc/forget.html");
});
app.post("/home/createaccount/login/forgetpassword",async(req,res)=>{
         const data= new mongomodel(req.body);
         const updtapassword=await bcrypt.hash(data.password,10);

         
         await mongomodel.updateOne({email:data.email},{$set:{password:updtapassword}})
         
         res.redirect("/home/createaccount/login");
});
//private rout
app.get("/profile",isLoggedIn,async(req,res)=>{
// req.user==tkoen se aa rha he
 const loginuser=await mongomodel.findOne({email:req.user.email});
//loginuser object he user email se find data ka
 const userdp=await mongodpcollection.findOne({_id:loginuser.dpcollectionid});
 //userdp object h dp object se find data ka
 res.render("chatui.ejs",{loginuser,userdp});

     
});
// post images api in multer
app.post("/profile",upload.single("profiledp"),isLoggedIn,async(req,res)=>{
    const data=req.file;// req.file me multer se upload file ka sara data object me aa rha he
  const objusercollection=await mongomodel.findOne({email:req.user.email});
    const objdpcollecition=await mongodpcollection.findOne({_id:objusercollection.dpcollectionid})
      
      
    await mongodpcollection.updateOne({_id:objdpcollecition._id},{$set:{profiledp:data.filename}});
      
    //res.redirect("/profile");
    res.redirect("/profile")
    

});


//logout 
app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/home");
    
});
//private rout middlewhere
function isLoggedIn(req,res,next){
  if(req.cookies.token==""){
    res.send("you logged out please login again to access this page")
}
    else 
    { const data=jwt.verify(req.cookies.token,"secratekey");
        req.user=data;
    }
    next();
  }
//listen port
        http.listen(3009,()=>{
    console.log("server run");
});