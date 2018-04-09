const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
  /*
  * Signup
  */
  app.post('/api/account/signup', function (req, res, next) {
    const {body} = req;
    console.log(req.body);
    const {
      firstName,
      lastName,
      password
    } = body;
    let {email} = body;

    if (!firstName) {
      return res.send({
        success: false,
        message: 'Error: First name cannot be blank'
      })
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: 'Error: Last name cannot be blank'
      })
    }
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank'
      })
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank'
      })
    }

    email = email.toLowerCase();

    User.find({email: email}, (err, prevUser) => {
      if (err) {
        return res.send('Error: Server error');
      } else if (prevUser.length > 0) {
        return res.send('Error: Account already exist');
      }
    });

    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    });
    newUser.password = newUser.generateHash(password);

    newUser.save((err, user) => {

      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }

      return res.send({
        success: true,
        message: 'Signed up'
      });
    });
  });

  /*
  * Signin
  */
  app.post('/api/account/signin', function (req, res, next) {
    const {body} = req;
    const {password} = body;
    let {email} = body;
    console.log(req);
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank'
      })
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank'
      })
    }

    email = email.toLowerCase();
    User.find({email}, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if (users.length !== 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid Email or Password'
        });
      }
      const user = users[0];
      console.log(user);
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid Email or Password'
        });
      }
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Valid sign in',
          token: doc._id
        });

      })
    });

  });

  /*
  * Verify
  */
  app.get('/api/account/verify', function (req, res, next) {
    const {query} = req;
    const {token} = query;
    console.log(token);
    UserSession.find({_id: token, isDeleted: false}, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if (sessions.length !== 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      } else {
        return res.send({
          success: true,
          message: 'Good'
        });
      }
    });
  });

  /*
  * Logout
  */
  app.post('/api/account/logout', function (req, res, next) {
    const {query} = req;
    const {token} = query;
    UserSession.findOneAndUpdate(
      {_id: token, isDeleted: false},
      {$set: {isDeleted: true}},
      null,
      (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      console.log(sessions);
      if (sessions.length !== 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      } else {
        return res.send({
          success: true,
          message: 'Good'
        });
      }
    });
  });

};
