const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing : Joi.object({
    title : Joi.string().required(),
    price : Joi.number().required().min(0),
    location : Joi.string().required(),
    country : Joi.string().required(),
    dscrpt : Joi.string().allow("",null),
    img : Joi.string().allow("",null),
    category: Joi.array().items(Joi.string()).optional(),
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review : Joi.object({
    rating : Joi.number().required().min(1).max(5),
    comment : Joi.string().required(),
  }).required(),
});