let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

let userList = [];

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

server.listen(3000, function(){
  console.log('listening on 3000...');
});

io.on('connection', function (socket) {

  socket.emit('news', "hello");

  socket.on('my other event', function (data) {
    console.log("server:" + data);
  });

  socket.on('getOnlineList', function () {
    let arr = [];
    for (let socketId in userList){
      arr.push({socketId: socketId, nick: userList[socketId].nick, gameState: userList[socketId].gameState});
    }
    socket.emit('refreshOnlineList', JSON.stringify(arr));
  });

  socket.on('initNick', function (nick) {
    let repeat = false;
    for (let socketId in userList){
      if (socketId !== socket.id){
        if (userList[socketId].nick === nick){
          repeat = true;
          socket.emit('initNickResult', {status : false, msg : "此昵称已经有人用了"});
        }
      }
    }
    if (!repeat){
      userList[socket.id] = {nick : nick, gameState : true};
      socket.emit('initNickResult', {status : true, msg : "昵称启用成功！"});
    }

  });

  socket.on('inviteGame', function (againstName) {
    if (userList[socket.id].nick === againstName){
      socket.emit('receiveGame', socket.id);
    }else {
      socket.to(againstId).emit('receiveGame', socket.id);
    }
  });

  socket.on('acceptGame', function (inviteId) {
    if (socket.id === inviteId){
      socket.emit('inviteResult', true);
    }else {
      socket.to(inviteId).emit('inviteResult', true);
    }
  });

  socket.on('refuseGame', function (inviteId) {
    console.log("收到拒绝请求");
    if (socket.id === inviteId){
      socket.emit('inviteResult', false);
    }else {
      socket.to(inviteId).emit('inviteResult', false);
    }
  });

  socket.on('disconnect', function(){
    delete userList[socket.id];
    console.log('user disconnected');
  });
});
