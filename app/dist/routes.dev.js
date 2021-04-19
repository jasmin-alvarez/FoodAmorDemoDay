"use strict";

module.exports = function (app, passport, db, multer, ObjectId) {
  //  needed to add the package multer 
  // Image Upload Code =========================================================================
  var storage = multer.diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, 'public/images/uploads');
    },
    filename: function filename(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + ".png");
    }
  });
  var upload = multer({
    storage: storage
  }); // normal routes ===============================================================
  // show the home page (will also have our login links)

  app.get('/', function (req, res) {
    res.render('index.ejs');
  });
  app.get('/payement', function (req, res) {
    res.render('payement.ejs');
  });
  app.get('/publicz', function (req, res) {
    res.render('publicz.ejs');
  });
  app.get('/finder', function (req, res) {
    res.render('finder.ejs');
  });
  app.get('/hash', function (req, res) {
    res.render('hash.ejs');
  });
  app.get('/post', function (req, res) {
    res.render('post.ejs');
  }); // ADMIN  PROFILE SECTION =========================

  app.get('/profile', isLoggedIn, function (req, res) {
    var uId = ObjectId(req.session.passport.user);
    db.collection('posts').find({
      'posterId': uId
    }).toArray(function (err, result) {
      if (err) return console.log(err);
      res.render('profile.ejs', {
        user: req.user,
        posts: result
      });
    });
  }); // ADMIN PUBLIC PROFILE SECTION =========================

  app.get('/profile/:posterId', isLoggedIn, function (req, res) {
    var uId = ObjectId(req.params.posterId);
    db.collection('posts').find({
      'posterId': uId
    }).toArray(function (err, result) {
      if (err) return console.log(err);
      res.render('publicz.ejs', {
        user: req.user,
        posts: result
      });
    });
  }); // STORE PAGE =========================

  app.get('/feed', function (req, res) {
    db.collection('posts').find().toArray(function (err, result) {
      if (err) return console.log(err);
      res.render('feed.ejs', {
        user: req.user,
        posts: result
      });
    });
  }); // INDIVIDUAL POST PAGE =========================

  app.get('/post/:zebra', function (req, res) {
    var postId = ObjectId(req.params.zebra);
    db.collection('posts').find({
      _id: postId
    }).toArray(function (err, result) {
      if (err) return console.log(err);
      res.render('post.ejs', {
        posts: result,
        user: req.user
      });
    });
  });
  app.get('/publicz/:zebra', function (req, res) {
    var postId = ObjectId(req.params.zebra);
    db.collection('posts').find({
      _id: postId
    }).toArray(function (err, result) {
      if (err) return console.log(err);
      db.collection('comments').find({
        posterId: postId
      }).toArray(function (err, result2) {
        res.render('publicz.ejs', {
          user: req.user,
          posts: result,
        });
      });
    });
  }); //Create Post =========================================================================

  app.post('/qpPost', upload.single('file-to-upload'), function (req, res, next) {
    var uId = ObjectId(req.session.passport.user);
    var word = req.body.caption;
    word = word.split(' ');
    var hashtags = [];

    for (var i = 0; i < word.length; i++) {
      console.log(word);

      if (word[i][0] === "#") {
        console.log(word[i].length);

        if (word[i].length < 2) {
          continue;
        } else {
          hashtags.push(word[i]);
          word[i] = "<a href=\"/hash/".concat(word[i].slice(1), "\">").concat(word[i], "</a>");
          console.log("".concat(word[i]));
        }
      }
    }

    word = word.join(' ');
    console.log(word);
    db.collection('posts').save({
      hashtags: hashtags,
      posterId: uId,
      caption: "<p>".concat(word, "</p>"),
      imgPath: 'images/uploads/' + req.file.filename,
      user: req.user.local.email
    }, function (err, result) {
      if (err) return console.log(err);
      console.log('saved to database');
      res.redirect('/profile');
    });
  });
  app["delete"]('/deletePost', function (req, res) {
    db.collection('posts').findOneAndDelete({
      _id: ObjectId(req.body.postId)
    }, function (err, result) {
      if (err) return res.send(500, err);
      res.send('Post deleted!');
    });
  }); // LOGOUT ==============================

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  }); // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================
  // locally --------------------------------
  // LOGIN ===============================
  // show the login form

  app.get('/login', function (req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  }); // process the login form

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    // redirect to the secure profile section
    failureRedirect: '/login',
    // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages

  })); // SIGNUP =================================
  // show the signup form

  app.get('/signup', function (req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  }); // process the signup form

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    // redirect to the secure profile section
    failureRedirect: '/signup',
    // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages

  })); // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future
  // local -----------------------------------

  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
}; // route middleware to ensure user is logged in


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}