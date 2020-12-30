var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/EmployeDB',{useNewUrlParser:true,useFindAndModify:true, useUnifiedTopology: true},
function(err){
    if(err) console.log('Connection Error');
    else{
        console.log('Connection Success');
    }
});
var EmployeSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    email:{ 
        type:String,
    },
    password:{
        type:String,
    },
    contact:{
        type:Number,
    },
});
module.exports = mongoose.model('bus',EmployeSchema);
