const Listing = require("../models/listing.js");
const routeKey = process.env.OPENROUTEKEY;

module.exports.index = async (req, res) => {
  let filter = {}; // Default: No filter (fetch all listings)

  let conditions = [];

  if (req.query.search) {
    conditions.push({
      $or: [
        { title: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } }
      ]
    });
  }else if (req.query.category) {
    conditions.push({ category: req.query.category });
  }

  if (conditions.length > 0) {
    filter = { $and: conditions };
  }
  console.log(filter);

  const allListings = await Listing.find(filter); // Correct way to pass the filter
  // console.log(allListings);
  res.render("listings/index.ejs", { allListings ,filter});
};



module.exports.renderNewListingForm = async (req,res) => {
  res.render("listings/newListing.ejs");
};

module.exports.showListing = async (req,res) => {
  const {id} =  req.params;
  const listing = await Listing.findById(id).populate({path : "reviews",populate : {path : "author"},}).populate("owner");
  if(!listing){
    req.flash("error","Listing You requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs",{listing});
};

module.exports.renderEditForm = async (req,res) => {
  const {id} =  req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing You requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImg = listing.img.url;
  originalImg = originalImg.replace("upload","upload/w_250");
  res.render("listings/edit.ejs",{listing,originalImg});
};

module.exports.addNewListing =  async (req, res) => {
  let prl = `https://api.openrouteservice.org/geocode/search?api_key=${routeKey}&text=${req.body.listing.location}`;
  console.log(req.body.listing.category);
  let response = await fetch(prl);
  let data = await response.json();
  // console.log(data.features[0].geometry);
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url ,"..",filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.img = {url, filename};
  newListing.geometry = data.features[0].geometry;
  let savedList = await newListing.save();
  console.log(savedList);
 req.flash("success","New Listing Created!!");
 res.redirect("listings");
};

module.exports.updateListing = async (req, res) => {

  let prl = `https://api.openrouteservice.org/geocode/search?api_key=${routeKey}&text=${req.body.listing.location}`;
  console.log(req.body.listing.category);
  let response = await fetch(prl);
  let data = await response.json();


  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing });
  listing.geometry = data.features[0].geometry;

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.img = {url, filename};
  }
  await listing.save();
  console.log("This is Edited..");
  req.flash("success","Listing Updated!!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
};