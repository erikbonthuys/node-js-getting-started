var mysql = require("mysql");
var pool = mysql.createPool({
    host: 'localhost',
    user: 'bookings',
    password: 'bookings',
    database: 'bookings',
    connectionLimit: 10,
    supportBigNumbers: true
});

exports.getConnection = function(callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      return callback(err);
    }
    callback(err, conn);
  });
};
