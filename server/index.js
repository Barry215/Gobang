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

  function syncOnlineList() {
    //发送在线列表
    let arr = [];
    for (let socketId in userList){
      arr.push({socketId: socketId, nick: userList[socketId].nick, gameState: userList[socketId].gameState});
    }
    io.emit('refreshOnlineList', JSON.stringify(arr));
  }

  socket.emit('news', "hello");

  socket.on('my other event', function (data) {
    console.log("server:" + data);
  });

  socket.on('initNick', function (nick) {
    let repeat = false;
    for (let socketId in userList){
      if (socketId !== socket.id){
        if (userList[socketId].nick === nick){
          repeat = true;
          socket.emit('initNickResult', false);
        }
      }
    }
    if (!repeat){
      userList[socket.id] = {nick : nick, gameState : true};
      socket.emit('initNickResult', true);

      syncOnlineList();
    }

  });

  socket.on('inviteGame', function (againstId) {
    if (socket.id === againstId){
      socket.emit('receiveGame', {inviteId:socket.id, inviteName: userList[socket.id].nick});
    }else {
      socket.to(againstId).emit('receiveGame', {inviteId:socket.id, inviteName: userList[socket.id].nick});
    }
  });

  socket.on('acceptGame', function (inviteId) {
    if (socket.id === inviteId){
      userList[socket.id].gameState = false;
      socket.emit('inviteResult', true);
    }else {
      userList[socket.id].gameState = false;
      userList[inviteId].gameState = false;
      socket.to(inviteId).emit('inviteResult', true);
    }

    syncOnlineList();
  });

  socket.on('refuseGame', function (inviteId) {
    console.log("收到拒绝请求");
    if (socket.id === inviteId){
      socket.emit('inviteResult', false);
    }else {
      socket.to(inviteId).emit('inviteResult', false);
    }
  });

  socket.on('gameTurn', function (data) {
    if (socket.id === data.againstId){
      socket.emit('isAfter', !data.isAfter);
    }else {
      socket.to(data.againstId).emit('isAfter', !data.isAfter);
    }
  });

  socket.on('pushChessBoard', function (data) {
    if (socket.id === data.againstId){
      socket.emit('pullChessBoard', {chessBoard: data.chessBoard, nextBlack: data.nextBlack});
    }else {
      socket.to(data.againstId).emit('pullChessBoard', {chessBoard: data.chessBoard, nextBlack: data.nextBlack});
    }
  });

  socket.on('disconnect', function(){
    delete userList[socket.id];
    syncOnlineList();
    console.log('user disconnected');
  });
});
