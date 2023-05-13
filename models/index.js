const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, 'contacts.json');

const updateAllContacts = async (contacts) => await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (id) => {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === id);
  return result || null;
};

const removeContact = async (id) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id);

  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);
  await updateAllContacts(contacts);
  return result;
};

const addContact = async ({ id, name, email, phone }) => {
  const contacts = await listContacts();
  const newContact = {
    id,
    name,
    email,
    phone
  };
  contacts.push(newContact);
  await updateAllContacts(contacts);
  return newContact;
};

const updateContact = async (id, { name, email, phone }) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id);

  if (index === -1) {
    return null;
  }
  
  const updatedContact = { id, name, email, phone };
  contacts[index] = updatedContact;
  await updateAllContacts(contacts);
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};