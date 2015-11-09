/**
 * Created by nikolay on 11/9/15.
 */


module.exports = function(server) {
    var io = require('socket.io').listen(server);
    io.set('origins', 'localhost:*');

    io.use(function(socket, next) {
        var handshakeData = socket.request;
        async.waterfall([
            function(callback) {

            }
        ]);
        // make sure the handshake data looks good as before
        // if error do this:
        // next(new Error('not authorized');
        // else just call next
        next();
    });

    io.on('connection', function(socket, next) {
        var handshakeData = socket.request;
        console.log("cookie " + socket.request.headers.cookie);

        socket.on('message', function(text, cb) {
            socket.broadcast.emit('message', text);
            cb && cb();
        });

    });
};