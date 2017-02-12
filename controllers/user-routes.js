var express = require('express'),
    _ = require('lodash'),
    config = require('../config'),
    jwt = require('jsonwebtoken'),
    userDA = require('../DAO/users');

var app = module.exports = express.Router();

function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secret, {
        expiresIn: 60 * 60 * 5
    });
}

function getUserScheme(req) {

    var username;
    var type;
    var userSearch = {};

    // The POST contains a username and not an email
    if (req.body.username) {
        username = req.body.username;
        type = 'username';
        userSearch = {
            username: username
        };
    }
    // The POST contains an email and not an username
    else if (req.body.email) {
        username = req.body.email;
        type = 'email';
        userSearch = {
            email: username
        };
    }

    return {
        username: username,
        type: type,
        userSearch: userSearch
    }
}

// app.post('/users', function(req, res) {
//
//   var userScheme = getUserScheme(req);
//
//   if (!userScheme.username || !req.body.password) {
//     return res.status(400).send("You must send the username and the password");
//   }
//
//   if (_.find(users, userScheme.userSearch)) {
//    return res.status(400).send("A user with that username already exists");
//   }
//
//   var profile = _.pick(req.body, userScheme.type, 'password', 'extra');
//   profile.id = _.max(users, 'id').id + 1;
//
//   users.push(profile);
//
//   res.status(201).send({
//     id_token: createToken(profile)
//   });
// });

app.post('/sessions/create', function(req, res) {


    if (!req.body.username || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }

    var user = null;

    userDA.getUserLogon(req.body.username, function(err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        } else {

            user = results[0];

            if (!user) {
                return res.status(401).send("The username or password don't match");
            }

            if (user.password !== req.body.password) {
                return res.status(401).send("The username or password don't match");
            }

            res.status(201).send({
                id_token: createToken(user)
            });
        }
    });


});
