const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index');
const mbxGeoCode = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeoCode({accessToken:mbxToken});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/campgrounds', { campgrounds });
};
module.exports.formToCreate = (req, res) => {
    res.render('campground/newcamp');
};

module.exports.createCamp = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await campground.save();
    console.log(campground)
    req.flash('success', 'Campground Created Successfully');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
    res.render('campground/details', { campground });
}
module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground Not Found');
        return res.redirect('/campgrounds');
    }
    res.render('campground/edit', { campground });
}
module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await campground.save();
    req.flash('success', 'Campground has been edited successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}
module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted successfully');
    res.redirect('/campgrounds');
}
