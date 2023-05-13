const Joi = require('joi');

const contactsSchema = Joi.object({
    name: Joi.string().required().label('name'),
    email: Joi.string().email().required().label('email'),
    phone: Joi.string().trim().pattern(/^\d{10}$/).required().label('phone'),
});

module.exports = contactsSchema;