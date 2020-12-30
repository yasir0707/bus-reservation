var  mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/BUS',{useNewUrlParser:true,useFindAndModify:true,useUnifiedTopology: true},function(err){
    if(err) console.log('connection error');
    else console.log('connection success');
});

var CitySchema = new mongoose.Schema({
    id:Number,
    city_name:String,
});
module.exports = mongoose.model('city',CitySchema);