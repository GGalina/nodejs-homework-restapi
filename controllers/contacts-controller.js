const { Contact } = require('../models/contact');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../utils');

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const query = { owner };
  if (favorite) {
    query.favorite = true;
  }

  const result = await Contact.find(query, "-createdAt -updatedAt", {skip,limit}).populate("owner", "-_id subscription email");
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: id, owner }).populate("owner", "-_id subscription email");

  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.deleteOne({ _id:id, owner });

  if (result.deletedCount === 0) {
    throw HttpError(404)
  }

  res.json({
    message: "Contact deleted"
  })
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const contact = await Contact.findOne({ _id: id, owner });

  if (!contact) {
    return next(HttpError(404));
  }

  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
    return next(HttpError(404));
  }
  res.status(201).json(result);
};

const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.updateOne({ _id: id, owner }, req.body, { new: true });
  
  if (result.modifiedCount === 0) {
    return next(HttpError(404));
  }
  const contact = await Contact.findById(id);
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