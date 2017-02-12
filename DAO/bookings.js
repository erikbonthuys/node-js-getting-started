var db = require('../helpers/database')


// Get records from a city
exports.getBookings = function(userid, callback) {
    var sql = 'SELECT' +
        '  a.booking_id,' +
        '  a.booking_desc,' +
        '  DATE_FORMAT(a.booking_date, "%Y-%m-%d") booking_date,' +
        '  a.aircraft_reg,' +
        '  a.booking_status,' +
        '  b.student_id,' +
        '  b.firstname,' +
        '  b.surname,' +
        '  c.instructor_name,' +
        '  d.slot_id,' +
        '  d.slot_desc,' +
        '  TIME_FORMAT(d.start_time, "%H:%i") start_time,' +
        '  TIME_FORMAT(d.end_time, "%H:%i") end_time,' +
        '  d.slot_type' +
        ' FROM' +
        '  bookings a' +
        ' LEFT OUTER JOIN students b' +
        ' ON' +
        '  a.student_id = b.student_id' +
        ' LEFT OUTER JOIN instructors c' +
        ' ON' +
        '  a.instructor_id = c.instructor_id' +
        ' LEFT OUTER JOIN booking_slots d' +
        ' ON' +
        '  a.slot_id = d.slot_id' +
        ' WHERE' +
        '  b.student_id = ?';
    // get a connection from the pool
    db.getConnection(function(err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, [userid], function(err, results) {
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
