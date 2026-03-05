const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const {isLoggedin, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedin , upload.single('listing[img]'), validateListing, wrapAsync(listingController.addNewListing));
//new Listing

router.get("/new", isLoggedin ,wrapAsync(listingController.renderNewListingForm));


router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedin, isOwner,upload.single('listing[img]'), validateListing,wrapAsync(listingController.updateListing))
.delete( isLoggedin, isOwner, wrapAsync(listingController.destroyListing));

//Edit Listing
router.get("/:id/edit", isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;