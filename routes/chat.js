/**
 * Created by nikol on 08.11.2015.
 */

//var User = require("models/user").User;

exports.get = function(req, res) {
    //var user = User.findOne({username: userName }, callback);
    res.render("chat");
};
