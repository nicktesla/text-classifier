var Song, mongoose;

mongoose = require('mongoose');

Song = new mongoose.Schema({
  title: String,
  lyrics: String
}, {
  strict: false
});
exports.Song = mongoose.model("Song", Song);