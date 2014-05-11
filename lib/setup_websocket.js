/**
 * Created by Nicu on 11/05/14.
 */
var sio = require('socket.io');
exports.
    configWebSocket = function (server) {
    var io = sio.listen(server)
        , nicknames = {};

    io.sockets.on('connection', function (socket) {
        socket.on('user message', function (msg) {
            socket.broadcast.emit('user message', socket.nickname, msg);
        });

        socket.on('nickname', function (nick, fn) {
            if (nicknames[nick]) {
                fn(true);
            } else {
                fn(false);
                nicknames[nick] = socket.nickname = nick;
                socket.broadcast.emit('announcement', nick + ' connected');
                io.sockets.emit('nicknames', nicknames);
            }
        });

        socket.on('disconnect', function () {
            if (!socket.nickname) return;

            delete nicknames[socket.nickname];
            socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
            socket.broadcast.emit('nicknames', nicknames);
        });
    });
};