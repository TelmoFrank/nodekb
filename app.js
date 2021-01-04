const express= require('express');
const path = require('path');
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database')
const passport = require('passport')
mongoose.set('useUnifiedTopology', true);

mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;
//Check connection
db.on('open', function(){
  console.log('Connected to MongoDB .... OK');
});
//db.disconnect();
//Check for DB  errors
db.on('error', function(err){
  console.log(err);
});

//Init app
const app = express();

//Bring in Models
let Article = require ('./models/article')

//Load view Engine PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parse middleware application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Parse application/json
app.use(bodyParser.json())

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user= req.user || null;
  next();
})

// Home Route
app.get('/', function(req, res){
     Article.find({}, function(err, articles){
     if(err) {
       console.log(err);
     } else {
         res.render('index',{
         title: 'Articles',
         articles: articles
       });
     }
  });
});
// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// Start server
 app.listen(3000, function(){
  console.log('Server started on port 3000..')
});
