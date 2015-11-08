var mongoose = require("libs/mongoose");
mongoose.set("debug", true);
var async = require("async"); // promises, q,

function open (callback) {
    mongoose.connection.on("open", callback)
}
function dropDb (callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback)
}

function requireModels (callback) {
    require("models/user");

    async.each(Object.keys(mongoose.models), function(item, callback) {
        mongoose.models[item].ensureIndexes(callback);
    }, callback);

}
function createUsers (callback) {
    //var User = require("models/user").User;

    var Users = [
        {username: "Vasya", password: "111"},
        {username: "Vasya", password: "222"},
        {username: "Sveta", password: "333"}
    ];
    async.each(Users, function(item, callback) {
        var user = new mongoose.models.User(item);
        user.save(callback);
    }, callback);
}

function close (callback) {
    mongoose.disconnect();
}

async.series([
    open,
    dropDb,
    requireModels,
    createUsers,
    close
], function(err, results) {
    //if (err){ throw err }
    console.log(arguments);
    mongoose.disconnect();
});
