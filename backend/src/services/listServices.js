const List = require("../models/listModel");

const getListsByUser = async (userId) => {
  return List.find({ userId }).sort({ createdAt: 1 });
};

const createListForUser = async ({ userId, name, movieIds = [] }) => {
  const list = await List.create({ userId, name, movieIds });
  return list;
};

const updateListForUser = async (userId, listId, updates) => {
  const list = await List.findOneAndUpdate(
    { _id: listId, userId },
    { ...updates, updatedAt: new Date() },
    { new: true },
  );
  return list;
};

const deleteListForUser = async (userId, listId) => {
  const result = await List.findOneAndDelete({ _id: listId, userId });
  return result;
};

module.exports = {
  getListsByUser,
  createListForUser,
  updateListForUser,
  deleteListForUser,
};
