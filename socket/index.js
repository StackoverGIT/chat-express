/**
 * Created by nikolay on 11/9/15.
 */


var io = require('socket.io')(server);

module.exports  = function (server) {
    io.set("origins", "localhost:*");

    io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('message', function (text, callback) {
            socket.broadcast.emit('message', text);
            //socket.emit('message', text);
            //console.log(text);
        });
    });
};
