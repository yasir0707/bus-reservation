var  mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/BUS',{useNewUrlParser:true,useFindAndModify:true,useUnifiedTopology: true},function(err){
    if(err) console.log('connection error');
    else console.log('connection success');
});

var CustomerSchema =  new mongoose.Schema({

    fullname:{type:String},
    email:{type:String},
    password:{type:String},
    gender:{type:String},
    address:{type:String},
    contact:{type:Number},
    image:{type:String},
    dob:{type:Date},
    
});
module.exports = mongoose.model('Customer',CustomerSchema);