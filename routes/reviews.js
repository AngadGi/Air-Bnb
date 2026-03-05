const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const Review = require("../models/review");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
//Add review
router.post("/",isLoggedin, validateReview ,wrapAsync(reviewController.addReview));

//Delete review 
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;