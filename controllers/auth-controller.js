const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const jimp = require('jimp');
const { User, schemas } = require('../models/user');
const { HttpError, sendEmail, createVerificationEmail } = require('../helpers');
const { ctrlWrapper } = require('../utils');
const { nanoid } = require('nanoid');
const avatarsDir = path.resolve('public', 'avatars');
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409,"Email in use");
    }

    const avatarUrl = gravatar.url(email);
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarUrl, verificationToken });
    
    const verifyEmail = createVerificationEmail(newUser.verificationToken, newUser.email)

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
};

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw HttpError(404, "User not found")
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
    res.status(200).json({
        message: "Verification successful"
    })
};

const resendVerifyEmail = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(400, "Missing required field email")
    }

    if (user.verify) {
        throw HttpError(400, "Verification has already been passed")
    }

    const verifyEmail = createVerificationEmail(user.verificationToken, user.email);

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent"
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    if (!user.verify) {
        throw HttpError(401, "Email not verified")
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

const updateAvatar = async (req, res) => {
    const { path: tempPath, originalname } = req.file;
    const resultDir = path.join(avatarsDir, originalname);
    const { _id } = req.user;

    const avatar = await jimp.read(tempPath);
    await avatar.resize(250, 250).write(resultDir);

    fs.rename(tempPath, resultDir);
    const avatarUrl = path.join('avatars', originalname);
    await User.findByIdAndUpdate(_id, { avatarUrl });

    res.json({
        avatarUrl,
    })
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    subscription: ctrlWrapper(subscription),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};