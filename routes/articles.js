const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//Bring in Article Model
let Article = require ('../models/article')
let User = require('../models/user')

// Routes ----------------------------------------------

//Load Edit Articles
router.get('/edit/:id',ensureAuthenticated,  function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id)
    {
      req.flash('danger','Not authorized');
      res.redirect('/');
    }
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});
// Add Article Route (GET)
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_article',{
    title: 'Add Article'
  });
});

// add submit route(POST)
router.post('/add',
[
  check('title').isLength({min:3}).trim().withMessage('Title required than 3 digits'),
  check('body').isLength({min:10}).trim().withMessage('Body required more than 10 digits')
],(req, res)=>{
   //Get errors
 const errors = validationResult(req);
 if(!errors.isEmpty()) {
     res.render('add_article', {
         title: 'Add Article',
         errors: errors
     });
 } else {
     let article = new Article();
     article.title = req.body.title;
     article.author = req.user._id;
     article.body = req.body.body;

     article.save((err) => {
         if(err) {
             console.log(err);
         } else {
             req.flash('success', 'Article Added');
             res.redirect('/');
         }
     });
 }
});

// update submit POST Route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.user._id; // req.body.author;
  article.body = req.body.body;

let query={_id:req.params.id}

  Article.updateOne(query, article, function(err){
    if (err){
      console.log(err);
      return;
    }else {
      {
        req.flash('success', 'Article Updated');
        res.redirect('/');
      }
    }
  })
  return;
});

//Delete Articles
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query= {_id:req.params.id}
Article.findById(req.params.id, function(err,article){
  if(article.author != req.user._id){
      res.status(500).send();
  }else {
    Article.deleteOne(query, function(err){
      if(err){
        console.log(err);
      }
      res.send('Success');
    });
  }
})


});

//Get single Articles
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err,user){
      res.render('article',{
      article:article,
      author:user.name
    })

    });
  });
});
// Access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else
  {
    req.flash('danger','Please login');
    res.redirect('/users/login');
  }
}
module.exports = router;
