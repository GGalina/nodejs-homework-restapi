const express = require('express');
const router = express.Router();
const contactsController = require('../../controllers/contacts-controller');
const { validate } = require('../../utils');
const { schema } = require('../../models/contact');
const { isValidId } = require('../../middlewares');

router.get('/', contactsController.listContacts);

router.get('/:id', isValidId, contactsController.getContactById);

router.post('/', validate.validateBody(schema.contactJoiSchema), contactsController.addContact);

router.delete('/:id', isValidId, contactsController.removeContact);

router.put('/:id', isValidId, validate.validateBody(schema.contactJoiSchema), contactsController.updateContact);

router.patch('/:id/favorite', isValidId, validate.validateFavBody(schema.contactUpdateFavoriteSchema), contactsController.updateStatusContact);

module.exports = router;