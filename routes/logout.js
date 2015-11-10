/**
 * Created by nikol on 10.11.2015.
 */

exports.post = function(req, res, next) {
    var sid = req.session.id;

    var io = req.app.get("io");
    req.session.destroy(function(err) {
        io.socket.$emit("session:reload", sid);
        if (err) return next(err);
        res.redirect("/");
    });

};