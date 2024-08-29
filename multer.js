//require multer to upload files and images
const multer=require("multer");
//set multer disk storage to store uploded files
const storage=multer.diskStorage({
    destination:function(req,file,cb/*callback*/){
        //syntax cb((1st perameter error),(2nd perameter uploded folder name))
        cb(null,"./public/uploadmulterdpfiles");
    },
    filename:function(req,file,cb/*callback*/){
        // change every filename in a unique filename
        cb(null,`${Date.now()}-${file.originalname}`);
}
});
//create midlewhere multer
const upload=multer({storage:storage});
module.exports=upload;