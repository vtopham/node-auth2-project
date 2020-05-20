const db = require('../db-config');

module.exports = {
    getUsers,
    addUser,
    getUserByUsername
}

function getUsers() {
    return db.select('*')
        .from('users')
} 

function addUser(credentials) {
    return db('users')
        .insert(credentials);
} 

function getUserByUsername(username) {
    return db.select('*')
        .from('users')
        .where({ username })
} 

