var express = require('express'),
    jwtexpress = require('express-jwt'),
    config = require('../config'),
    dotenv = require('dotenv'),
    jwt = require('jsonwebtoken'),
    bookingDA = require('../DAO/bookings');

var app = module.exports = express.Router();

dotenv.load();

var jwtCheck = jwtexpress({
    secret: config.secret
});

app.use('/api/protected', jwtCheck);

app.get('/api/protected/student/bookings', function(req, res) {

    var token = req.get("Authorization").replace('Bearer ', '');
    var decoded = jwt.decode(token);

    bookingDA.getBookings(decoded.id, function(err, results) {
        if (err) {
            res.send(500, "Server Error");
            return;
        } else {
            // Respond with results as JSON
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                'bookings': results
            }));
        }
    });
})
