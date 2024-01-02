const mongoose =require('mongoose');
const ratingSchema = mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
}); 
// we don't need to add model we just want a structor like object if we add the model it gonna create an id and version which we not need
module.exports= ratingSchema;