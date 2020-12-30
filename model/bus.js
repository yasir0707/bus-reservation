var  mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/BUS',{useNewUrlParser:true,useFindAndModify:true,useUnifiedTopology: true},function(err){
    if(err) console.log('connection error');
    else console.log('connection success');
});

var BusSchema = new mongoose.Schema({
    bus_name:String,
    bus_number:String,
    bus_seat:Number
});

module.exports = mongoose.model('bus_detail',BusSchema);