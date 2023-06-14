const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: subscriptionList,
        default: "starter"
    },
    avatarUrl: {
        type: String,
        required: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },
    token: String

}, {
    versionKey: false,
    timestamps: true
});

userSchema.post("save", handleMongooseError);

const userRegisterSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const updateSubscription = Joi.object({
    subscription: Joi.string().valid(...subscriptionList).required(),
});

const emailSchema = Joi.object({
    email: Joi.string().required(),
});

const schemas = {
    userRegisterSchema,
    userLoginSchema,
    updateSubscription,
    emailSchema,
};

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
};