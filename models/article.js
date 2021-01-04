let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodekb', { useNewUrlParser: true });
//Articles Schema
let articleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }
});
let Article = module.exports = mongoose.model('articles', articleSchema);
