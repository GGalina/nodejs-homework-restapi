const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, schemas } = require('../models/user');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../utils');
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409,"Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const result = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
        user: {
            email: result.email,
            subscription: result.subscription,
        }
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
};

const logout = async (req, res) => {
    const { _id: id } = req.user;
    await User.findByIdAndUpdate(id, { token: "" });

    res.status(204).json()
};

const getCurrent = async (req, res) => {
    const { subscription, email } = req.user;

    res.json({
        email,
        subscription,
    })
};

const subscription = async (req, res, next) => {
    const { subscription } = req.body;
    const { _id: id } = req.user;

    try {
        await schemas.updateSubscription.validateAsync({ subscription }); 
    } catch (error) {
        return next(HttpError(400, "Invalid subscription value"));
    }

    const update = await User.findByIdAndUpdate(id, { ...req.body }, { new: true });

    if (update.modifiedCount === 0) {
        return next(HttpError(404));
    }

    const user = await User.findById(id);
    res.json({
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    subscription: ctrlWrapper(subscription),
};