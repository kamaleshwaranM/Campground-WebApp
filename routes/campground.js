if(process.env.NODE_ENV !== "productiion"){
    require('dotenv').config()
}
const express = require('express');
const router = express.Router();
const HelpAsync = require('../utils/helpAsync');
const { isLoggedIn,isAuthCamp,serverCampValidater } = require('../utils/middleware');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({storage});


router.route('/')
.get(HelpAsync(campgrounds.index))
.post(isLoggedIn,upload.array('image'), serverCampValidater, HelpAsync(campgrounds.createCamp));

router.get('/create', isLoggedIn, campgrounds.formToCreate);

router.route('/:id')
.get(HelpAsync(campgrounds.showCamp))
.put(isLoggedIn, isAuthCamp,upload.array('image'), serverCampValidater, HelpAsync(campgrounds.updateCamp))
.delete(isLoggedIn, isAuthCamp, HelpAsync(campgrounds.deleteCamp))

router.get('/:id/edit', isLoggedIn, isAuthCamp, HelpAsync(campgrounds.editForm));


module.exports = router;