const contactsService = require('../models');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../utils');
const { nanoid } = require('nanoid');

const listContacts = async (req, res, next) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.removeContact(id);

  if (!contact) {
    throw HttpError(404)
  }

  res.json({
    message: "Contact deleted"
  })
};

const addContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const id = nanoid();
  const contact = await contactsService.addContact({ id, name, email, phone });
  res.status(201).json(contact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const contact = await contactsService.updateContact(id, { name, email, phone });

  if (!contact) {
    return next(HttpError(404));
  }

  res.status(201).json(contact);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
};