const express = require('express');
const authControllers = require('../../controllers/auth-controller');
const { authenticate } = require('../../middlewares');
const { schemas } = require('../../models/user');
const { validate } = require('../../utils');
const router = express.Router();

router.post('/register', validate.validateBody(schemas.userRegisterSchema), authControllers.register);

router.post('/login', validate.validateBody(schemas.userLoginSchema), authControllers.login);

router.post('/logout', authenticate, authControllers.logout);

router.get('/current', authenticate, authControllers.getCurrent);

router.patch('/', authenticate, validate.validateSubscription(schemas.updateSubscription), authControllers.subscription);

module.exports = router;