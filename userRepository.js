// userRepository.js

const users = [];
let nextId = 1;

function findByUsername(username) {
  return users.find((u) => u.username === username);
}

function findById(id) {
  return users.find((u) => u.id === id);
}

function create(username, hashedPassword) {
  const newUser = { id: nextId++, username, password: hashedPassword };
  users.push(newUser);
  return newUser;
}

module.exports = { findByUsername, findById, create };
