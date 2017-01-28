var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser'),
	  pg 				= require('pg');

var app = express();

var DATABASE_URL= "postgres://gvbwgrfztwgexx:90bafde89c566fb2e2bec36a2d1d5caef58a9fec2e3379725e1bbaad6c3f837b@ec2-54-235-173-161.compute-1.amazonaws.com:5432/dee295gbdmgsim?sslmode=require";

dotenv.load();

// Parsers
// old version of line
// app.use(bodyParser.urlencoded());
// new version of line
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

app.use(require('./anonymous-routes'));
app.use(require('./protected-routes'));
app.use(require('./user-routes'));

app.get('/db', function (request, response) {
  // pg.connect(process.env.DATABASE_URL || DATABASE_URL, function(err, client, done) {
  //   client.query('SELECT * FROM test_table', function(err, result) {
  //     done();
  //     if (err)
  //      { console.error(err); response.send("Error " + err); }
  //     else
  //
  //      { response.send("Results " + result.rows[0].name); }
  //   });
  // });

  pg.connect(process.env.DATABASE_URL || DATABASE_URL, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return response.status(500).json({success: false, data: err});
    }

    // SQL Query > Select Data
    const query = client.query('SELECT * FROM test_table');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return response.json(results);
    });
  });
});

var port = process.env.PORT || 3001;

http.createServer(app).listen(port, function (err) {
  console.log('listening on http://localhost:' + port);
});
