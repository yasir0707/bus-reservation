var express = require('express');
var app = express();
var router = express.Router();
var CustomerModal = require('../model/Customer');
var Customer = CustomerModal.find({});
var multer = require('multer');
var path  = require('path');
app.use("/static",express.static(__dirname+'../static'));
app.set("view engine","ejs");
//Image Upload
var Storage = multer.diskStorage({
    destination:'../public/upload',
    filename:(req,file, cb)=>{
        cb(null,file.filename+Date.now()+path.extname(file.originalname));
    }
});
var upload = multer({
    storage:Storage
}).single('file');

//Registeration Page
router.get('/register',function(req,res,next) {
    res.render('user/register',{title:'Register page',msg:''});
});

router.post('/register',upload,function(req,res,next) {
    var fullname = req.body.fullname;
    var email = req.body.email;
    var password = req.body.password;
    var cpass = req.body.cpass;
    var contact = req.body.contact;
    var gender= req.body.gender;
    var address= req.body.address;
    var dob= req.body.dob;
    var imageName = req.file.filename;
    if(password != cpass){
        res.render('user/register',{title:'Register page',msg:'Password not matched'});
      
    }else{
        
    
    var CustomerDetail = new CustomerModal({
        fullname:fullname,
        email:email,
        password:password,
        contact:contact,
        gender:gender,
        address:address,
        dos:dob,
        image:imageName
    });
    CustomerDetail.save(function(err,data){
        if(err) throw err;
        else{
            
             res.render('user/register',{title:'Register page',msg:'Registeration successfull'});
        }
    
    });
}
});


router.get('/customer',function(req,res,next){
    res.render('user/show',{title:'Customer Detail',records:data});
   
  });
router.get('/home',function(req,res,next){
    res.render('user/home',{title:'Home Page'});
});
module.exports = router;