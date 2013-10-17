var models, mongoose;

mongoose = require('mongoose');
models = require('./models');


exports.Song = models.Song;


exports.loadDB = function() {
  var MONGO_URL = 'mongodb://localhost/songs';
  console.log('calling mongoose connect');
  mongoose.connect(MONGO_URL, {
    db: {
      safe: true
    }
  }, function(err) {
    if (err != null) {
      console.log("Mongoose - connection error: " + err);
    }
    return console.log("Mongoose - connection OK");
  });
};
