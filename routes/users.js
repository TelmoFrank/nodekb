const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const passport = require('passport')
//Bring in User Model
let User = require ('../models/user')

// Register Form\
router.get('/register',function(req,res){
  res.render('register');
});

//Register Process
router.post('/register',
[
  check('name', 'Name is required').isLength({min: 1}),
  check('email', 'Email is required').isLength({min: 1}),
  check('email', 'Email is not valid').isEmail(),
  check('username', 'Username is required').isLength({min: 1}),
  check('password', 'Password is required').isLength({min: 1}),
  check('password2', 'Passwords should match').custom((value, {req}) => {  return value === req.body.password; })
],(req, res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      res.render('register', {
          title: 'Register',
          errors: errors
      });
  } else {

      //bcrypt.genSalt(10, function(err, salt){
      //bcrypt.hash(newUser.password, salt, function(err, hash){
      const salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(req.body.password, salt);
      // if(err){
      //   console.log(err);
      // }
          let newUser = new User({
            name:req.body.name,
            email:req.body.email,
            username:req.body.username,
            password:hash
          });
          newUser.save((err) => {
              if(err) {
                  console.log(err);
              } else {
                  req.flash('success', 'You are now register and now you can log in.');
                  res.redirect('/users/login');
              }
          });
        //})
      //})
  }
});
//login  Form
router.get('/login', function(req, res){
  res.render('login');
});
//Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req, res, next);
});
//Logout
router.get('/logout', function(req,res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
})
module.exports = router;
