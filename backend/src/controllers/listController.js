const {
  getListsByUser,
  createListForUser,
  updateListForUser,
  deleteListForUser,
} = require("../services/listServices");

const getUserLists = async (userId) => {
  return getListsByUser(userId);
};

const createUserList = async ({ userId, name, movieIds }) => {
  return createListForUser({ userId, name, movieIds });
};

const updateUserList = async (userId, listId, updates) => {
  return updateListForUser(userId, listId, updates);
};

const deleteUserList = async (userId, listId) => {
  return deleteListForUser(userId, listId);
};

module.exports = {
  getUserLists,
  createUserList,
  updateUserList,
  deleteUserList,
};
