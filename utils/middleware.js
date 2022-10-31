const Campground = require('../models/campground');
const Review = require('../models/review')
const { serverReviewSchema,servercampSchema  } = require('./serverSchema');
const AppError = require('./AppError');

module.exports.serverCampValidater = (req, res, next) => {
    const { error } = servercampSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else  next();
}
module.exports.isAuthCamp = async(req,res,next) =>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error','You are not allowed!');
        return res.redirect(`/campgrounds/${id}`)
    }next();
}
module.exports.isAuthReview = async(req,res,next) =>{
    const {id,reviewID} = req.params;
    const review = await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You are not allowed!');
        return res.redirect(`/campgrounds/${id}`)
    }next();
}
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be LoggedIn first');
        return res.redirect('/login');
    }
    next();
}
module.exports.serverReviewValidator = (req, res, next) => {
    const { error } = serverReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    }
    else next();
};
