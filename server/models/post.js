const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  caption: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageName: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('Post', postSchema);