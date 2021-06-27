const UsersFood = require("../db/models/user")
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

function isSignIn(req, res, next) {
  var email = req.body.email;
  UsersFood.findOne({ Email: email })
    .then((response) => {
      req.userDetails = response;
      req.session.name = response.Name;
      req.session.id = response._id;
      if (bcrypt.compareSync(req.body.password, req.userDetails.Password)) {
        const token = jwt.sign(
          {
            user_id: response._id,
          },
          "secret",
          {
            expiresIn:'1h'
          }
        );
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
        });
        next();
      } else {
        res.clearCookie('connect.sid');
        res.render("signin",{msg: "Incorrect password"});
      }
    })
    .catch((err) => {
      res.clearCookie('connect.sid');
      res.render("signin",{msg: "User not found!"});
    });
}

  
  
  function isAuthorized(req, res, next) {
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];
      const tokennn = token.split(":")[0].split(";")[0];
      jwt.verify(tokennn, "secret", (err, data) => {
        if (data && data.user_id) {
          next();
        } else {
          res.redirect('/logout')
        }
      });
    } else {
      res.redirect("/signin")
    }
  }

  
  module.exports = {isAuthorized, isSignIn}