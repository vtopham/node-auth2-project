
// /api
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secret = require('../config/secrets')

const router = express.Router();
const Users = require('./api-model')

function generateToken(user) {
    const payload = {
        subject: user.id
    };
    
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
                //check to see if the password is correct
                if(bcrypt.compareSync( req.body.password, user.password)){
                    //if correct then we'll generate a nice little token and send it over
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
router.get('/users',  validateToken, (req, res) => {
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

function validateToken(req, res, next) {
    //verify that the user is logged in
    const token = req.headers.authorization;
    if(token) {
        jwt.verify(token, secret, (error, decodedToken) => {
            if(error) {
                res.status(401).json({message: "Invalid credentials"})
            } else {
                //if the token is good
                req.jwt = decodedToken;
                next();
            }
        })
    } else {
        res.status(400).json({message: "Please include your token."})
    }

}

module.exports = router;