
// /api
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router();
const Users = require('./api-model')

function generateToken(user) {
    const payload = {
        subject: user.id
    };
    const secret = "banana";
    const options = {
        expiresIn: '8h'
    };
    return jwt.sign(payload, secret, options);
}
//Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
router.post('/register', validateCredentials, (req, res) => {
    const userSignUp = req.body;
    const hash = bcrypt.hashSync(userSignUp.password);
    userSignUp.password = hash;

   
    Users.addUser(userSignUp)
        .then(id => {
            res.status(201).json({message: `user ${id} successfully created`})
        })
        .catch(err => {
            res.status(500).json({message: "error creating user", error: err})
        });


})

//Use the credentials sent inside the body to authenticate the user. On successful login, create a new JWT with the user id as the subject and send it back to the client. If login fails, respond with the correct status code and the message: 'You shall not pass!'
router.post('/login', validateCredentials, (req, res) => {
    Users.getUserByUsername(req.body.username)
        .then(users => {
            if(users.length === 0) {
                res.status(404).json({message: "User not found"})
            } else {
                user = users[0]
                if(bcrypt.compareSync( req.body.password, users[0].password)){
                const token = generateToken(user)

                res.status(200).json({message: "Welcome", token: token})
                } else {
                    res.status(403).json({message: "You shall not pass! Incorrect password."})
                }
            }
        })
        .catch(err => {
            res.status(500).json({message: "error creating user", error: err})
        });
})


//If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in respond with the correct status code and the message: 'You shall not pass!'.
router.get('/users', (req, res) => {
    Users.getUsers()
        .then(users => {
            res.status(200).json({data: users})
        })
        .catch(err => {
            res.status(500).json({message: "error retrieving users from database", error: err})
        });
});

function validateCredentials(req, res, next) {
    if(req.body && req.body.username && req.body.password) {
        next();
    } else {
        res.status(400).json({message: "Please include a username and password in the body"})
    }
}

module.exports = router;