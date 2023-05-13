const express = require('express');
const router = express.Router();
const contactsController = require('../../controllers/contacts-controller');
const { validateBody } = require('../../utils');
const { contactsSchema } = require('../../schemas');

router.get('/', contactsController.listContacts);

router.get('/:id', contactsController.getContactById);

router.post('/', validateBody(contactsSchema), contactsController.addContact);

router.delete('/:id', contactsController.removeContact);

router.put('/:id', validateBody(contactsSchema), contactsController.updateContact);

module.exports = router;