const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const optns = {toJSON: {virtuals: true}};
const imageSchema = new Schema({
    url:String,
    filename:String
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    images:[imageSchema],
    description: String,
    location: String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
        
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},optns);

campgroundSchema.virtual('properties.markUpText').get(function(){
    return `<strong><a href="campgrounds/${this._id}"> ${this.title}</a></strong>`
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);