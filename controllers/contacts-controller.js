const { Contact } = require('../models/contact');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../utils');

const listContacts = async (req, res) => {
  const contacts = await Contact.find({}, "-createdAt -updatedAt");
  res.json(contacts);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);

  if (!contact) {
    throw HttpError(404);
  }
  res.json(contact);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    throw HttpError(404)
  }

  res.json({
    message: "Contact deleted"
  })
};

const addContact = async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json(contact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndUpdate(id, req.body, {new: true});

  if (!contact) {
    return next(HttpError(404));
  }

  res.status(201).json(contact);
};

const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  
  if (!contact) {
    return next(HttpError(404));
  }
  res.json(contact);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};