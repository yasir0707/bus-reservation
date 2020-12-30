var  mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/BUS',{useUnifiedTopology: true,useFindAndModify:true,useNewUrlParser: true},function(err){
    if(err) console.log('connection error');
    else console.log('connection success');
});