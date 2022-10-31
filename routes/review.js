
const express = require('express');
const router = express.Router({ mergeParams: true });
const HelpAsync = require('../utils/helpAsync');
const { serverReviewValidator, isLoggedIn, isAuthReview } = require('../utils/middleware');
const reviews = require('../controllers/reviews')

router.post('/', serverReviewValidator, isLoggedIn, HelpAsync(reviews.createReview));
router.delete('/:reviewID', isLoggedIn, isAuthReview, HelpAsync(reviews.deleteReview));

module.exports = router;