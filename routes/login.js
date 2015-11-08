/**
 * Created by nikol on 08.11.2015.
 */

var User = require("models/user").User;
var async = require("async");
var HttpError = require('error').HttpError;

exports.get = function(req, res) {
    res.render("login");
};

exports.post = function(req, res, next) {

    var userName = req.body.username;
    var password = req.body.password;

    async.waterfall([
        function(callback) {
            User.findOne({username: userName }, callback);
        },
        function(user, callback) {
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    next(new HttpError(403, "Incorrect password"))
                }
            } else {
                var newUser = new User({username: userName, password: password})
                newUser.save(function(err, user) {
                    if (err) return next(err);
                    callback(null, user)
                })
            }
        }
    ], function (err, user) {
        if (err) return next(err);
        req.session.user = user._id;
        //res.end()
        res.send({})
    });


    //User.findOne({username: userName }, function(err, user) {
    //    if (err) return next (err);
    //
    //    if (user) {
    //      if (user.checkPassword(password)) {
    //          // .200
    //      } else {
    //          // 403
    //      }
    //    } else {
    //
    //      }
    //})
};
