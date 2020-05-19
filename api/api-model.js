const db = require('../db-config');

module.exports = {
    getUsers,
    addUser,
    getUserByUsername
}

function getUsers () {
    return db.select('*')
        .from('users')
} 

function addUser () {
    return 
} 

function getUserByUsername () {
    return 
} 

