const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },  
}, { versionKey: false, timestamps: true });

const contactJoiSchema = Joi.object({
  name: Joi.string().required().label('name'),
  email: Joi.string().email().required().label('email'),
  phone: Joi.string().trim().pattern(/^\d{10}$/).required().label('phone'),
  favorite: Joi.boolean(),
});

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schema = {
  contactJoiSchema,
  contactUpdateFavoriteSchema,
};

contactSchema.post("save", handleMongooseError);
const Contact = model('Contact', contactSchema, 'contacts');

module.exports = {
  Contact,
  schema,
};