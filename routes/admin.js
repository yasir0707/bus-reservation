var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();
var EmpModel = require('../model/admin');
var jwt = require('jsonwebtoken');
var Emp = EmpModel.find({});
var bcrypt = require('bcrypt');
var BusModel = require('../model/bus');
var Bus  = BusModel.find({});
var CityModal = require('../model/city');
var City = CityModal.find({});
var StopModal = require('../model/stop');
var Stop = StopModal.find({});
var ScheduleModal = require('../model/Schedule');
var Schedule = ScheduleModal.find({});
var CustomerModel = require('../model/Customer');
var Customer = CustomerModel.find({});

var ejsLint = require('ejs-lint');

app.set('static',path.join(__dirname,'../static'));

router.use('/index',function(req,res){
  res.render('admin/index');
});

router.use(express.static(path.join(__dirname,'views/admin')));
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
  
  function checkLogin(req,res,next){
    try{
      var TK = localStorage.getItem('TK');
      var decode = jwt.verify(TK,'IdToken')
    }catch(er){
        res.redirect('/admin/login');
    }
    next();
  }

router.get('/head',function(req,res,next){
  var loguser = localStorage.getItem('User');
    res.render('admin/header',{title:'Admin Header',logUser:loguser});

});
router.get('/f',function(req,res,next){
    res.render('adminfoot',{title:'Admin Header'});
});

function checkEmail(req,res,next){
    var email = req.body.email;
    var check = EmpModel.findOne({email:email});
    check.exec((err,data)=>{
      if(err) throw err; 
      if(data){
        return res.render('admin/signup',{title:'Signup Page',msg:'Email already exit'});
      }
      next();
    });
 }
 function checkName(req,res,next){
   var username = req.body.username;
   var check = EmpModel.findOne({username:username});
   check.exec((err,data)=>{
     if(err) throw err; 
     if(data){
       return res.render('admin/signup',{title:'Signup Page',msg:'Username already exit'});
     }
     next();
   });
 }

//signup page
router.get('/signup',function(req,res){
    res.render('admin/signup',{title:'Signup Page',msg:''});
  });
router.post('/signup',checkEmail,checkName, function(req,res){
    var username= req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var cpass = req.body.cpass;
    var contact = req.body.contact;
    if(password !== cpass){
      res.render('admin/signup',{title:'Signup Page',msg:'Password not matched'});
    }
    else{
      password = bcrypt.hashSync(req.body.password,13);
      var EmpDetail = new EmpModel({
        username:username,
        email:email,
        password:password,
        contact:contact
      });
      EmpDetail.save((err,doc)=>{
          if(err) throw err;
          else{
              res.render('admin/signup',{title:'Signup Page',msg:'Registered Successfull'});
          }
      });  
    }
      
  });

//Login 
router.get('/login',function(req,res){
  res.render('admin/login',{title:'Login Page',msg:''});
});
router.post('/login',function(req,res){
  var email = req.body.email;
  var password = req.body.password;
  var EmpDetail = new EmpModel({
    email:email,
    password:password,
  });
var check   = EmpModel.findOne({email:email});
check.exec(function(err,data){
  if(err) throw err;
  // var getUser = data.username;
  var getID = EmpDetail._id;
  var getPassword = data.password;
  if(bcrypt.compareSync(password,getPassword)){
    var token = jwt.sign({'UserID':getID},'IdToken');
    localStorage.setItem('TK',token);
    localStorage.setItem('User',email);
    res.redirect('/admin');
      
    res.render('admin/login',{title:'Login Page',msg:'Login success'});
  }
  else{
    res.render('admin/login',{title:'Login Page',msg:'Login Failed'});
  }
});
});
//Logout
router.get('/admin/logout',function(req,res){
  localStorage.removeItem('User');
  localStorage.removeItem('TK');
  res.redirect('/admin/login');
});


//Bus page
router.get('/bus',function(req,res,next){
  
      res.render('admin/bus',{title:'Bus'});
   
});
router.post('/bus',function(req,res,next){
  var BusDetail = new BusModel({
    bus_name:req.body.busName,
    bus_number:req.body.busNumber,
    bus_seat:req.body.busSeat,
  });
  
BusDetail.save(function(err,data){
  if(err) throw err;
  else{
    res.render('admin/bus',{title:'Bus Page',records:data,msg:'Successfull added'});
  }
});
});

//Show Bus Data
router.get('/busShow',function(req,res,next){
  Bus.exec(function(err,data){
    if(err) throw err;
    else{
      res.render('admin/busShow',{title:'Bus',records:data})
    }
  });
});
// Delete Bus Data
router.get('/busShow/delete/:id',function(req,res,next){
  var id = req.params.id;
  var del = BusModel.findByIdAndDelete(id);
  del.exec(function(err,data){
    if(err) throw err;
    else{
      res.redirect('/admin/busShow');
    }
  });
});
//city 
router.get('/city',function(req,res,next){
  res.render('admin/city',{title:'Admin City Page',msg:''});
});
router.post('/city',function(req,res,next){
  
  var CityDetail = new CityModal({
    city_name:req.body.city,
    id:req.body.Id,
  });
  CityDetail.save(function(err,data){
    if(err) throw err;
    else{
        
  res.render('admin/city',{title:'City Page',msg:'Successfull added'});
    }
  });
  res.render('admin/city',{title:'City page'});
});
//City Show
router.get('/cityShow',function(req,res,next){
  City.exec(function(err,data){
    if(err) throw err;
    else{
      
  res.render('admin/cityShow',{title:'Admin City Page',msg:'',records:data});
    }
  });
});
//City delete
router.get('/cityShow/delete/:id',function(req,res,next){
  var id = req.params.id;
  var del= CityModal.findByIdAndDelete(id);
  del.exec(function(err,data){
    if(err) throw err;
    res.redirect('/admin/cityShow');
  });
});
//Stop 
router.get('/stop',function(req,res,next){
  City.exec(function(err,data){
    if(err) throw err;
    else{
    res.render('admin/stop',{title:'Admin City Page',msg:'',records:data});
    }
  });
});
router.post('/stop',function(req,res,next){
  
  var StopDetail = new StopModal({
    
    id:req.body.Id,
    stop_name:req.body.stop,

    city_id:req.body.city_id,
  });
  StopDetail.save(function(err,data){
    if(err) throw err;
    else{
        
  res.render('admin/stop',{title:'stop Page',msg:'Successfull added',records:data});
    }
  });
});
//Stop Show
router.get('/stopShow',function(req,res,next){
  Stop.exec(function(err,data){
    if(err) throw err;
    else{
      
  res.render('admin/stopShow',{title:'Admin City Page',msg:'',records:data});
    }
  });
});
//Stop delete
router.get('/stopShow/delete/:id',function(req,res,next){
  var id = req.params.id;
  var del= StopModal.findByIdAndDelete(id);
  del.exec(function(err,data){
    if(err) throw err;
    res.redirect('/admin/stopShow');
  });
});
// Schedule 
router.get('/schedule',function(req,res,err){

  
  City.exec(function(err,data){
      if(err) throw err;
      else{
        Stop.exec(function(err,dat){
          if(err) throw err;
          else{
            res.render('admin/Schedule',{title:'Schedule Page',msg:'',record:dat,records:data});
           }
        });
       }
    });
  
});

router.post('/schedule',function(req,res,err){
    
  var ScheduleDetail = new ScheduleModal({
    arr:req.body.arr,
    dep:req.body.dep,
    arr_stop:req.body.arr_stop,
  });
  res.render('admin/Schedule',{title:'Schedule Page',msg:''});
});

//  CUSTOMER DETAIL 
router.get('/customer',function(req,res,next){
  Customer.exec(function(err,data){
    if(err) throw err;
    else{
        res.render('admin/customer',{title:'Customer Detail',records:data});
    }
  });
});

module.exports = router;