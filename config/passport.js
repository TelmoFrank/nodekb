const LocalStrategy =require('passport-local').Strategy;
const User = require('../models/user');
const config =require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  //Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    //Match username
    let query = {username:username};

    User.findOne(query, function(err, user){
      if (err) throw err;
      if(!user){
        return done(null, false, {message:'No user found.'})
      }
      //Match passport
      var result = bcrypt.compareSync(password, user.password);
      if (result) {
        console.log("Password correct");
        return done(null, user);
      } else {
        console.log("Password wrong");
        return done(null, false, {message:'Password wrong.'})
      }
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
