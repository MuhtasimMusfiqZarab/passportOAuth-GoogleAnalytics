//mongoose model class for creating user collection
const mongoose = require('mongoose');
const { Schema } = mongoose;

//different properties inside use collection DB
const userSchema = new Schema({
  googleID: String,
});

//create model class
mongoose.model('users', userSchema);
