var db = require('../helpers/database')


// Get records from a city
exports.getUserLogon = function(email, callback) {
    var sql = 'select user_id, email, password from users where email = ?';

    // get a connection from the pool
    db.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};
