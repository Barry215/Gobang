let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

// io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
// io.set('origins', '*:*');

let userList = [];

// 目录最好不要放在root目录下，因为这样就需要在nginx的conf上说明是root用户

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

server.listen(3001, function(){
  console.log('listening on 3001...');
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
    let gameState = true;
    for (let socketId in userList){
      if (socketId !== socket.id){
        if (userList[socketId].nick === nick){
          repeat = true;
          socket.emit('initNickResult', false);
        }
      }else {
        gameState = userList[socket.id].gameState;
      }
    }
    if (!repeat){
      userList[socket.id] = {nick : nick, gameState : gameState};
      socket.emit('initNickResult', true);

      syncOnlineList();
    }

  });

  socket.on('inviteGame', function (challengeId) {
    if (socket.id === challengeId){
      socket.emit('receiveGame', {inviteId:socket.id, inviteName: userList[socket.id].nick});
    }else {
      socket.to(challengeId).emit('receiveGame', {inviteId:socket.id, inviteName: userList[socket.id].nick});
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
    if (socket.id === inviteId){
      socket.emit('inviteResult', false);
    }else {
      socket.to(inviteId).emit('inviteResult', false);
    }
  });

  socket.on('gameTurn', function (data) {
    let isOnline = false;
    for (let socketId in userList){
      if (socketId === data.againstId){
        isOnline = true;
        break;
      }
    }
    if (isOnline){
      if (socket.id === data.againstId){
        socket.emit('isAfter', !data.isAfter);
      }else {
        socket.to(data.againstId).emit('isAfter', !data.isAfter);
      }

      userList[socket.id].gameState = false;
      userList[data.againstId].gameState = false;
      syncOnlineList();
    }else {
      socket.emit('offline',data.againstId);
    }


  });

  socket.on('pushChessBoard', function (data) {
    if (socket.id === data.againstId){
      socket.emit('pullChessBoard', {chessBoard: data.chessBoard, nextBlack: data.nextBlack});
    }else {
      socket.to(data.againstId).emit('pullChessBoard', {chessBoard: data.chessBoard, nextBlack: data.nextBlack});
    }
  });

  socket.on('forgiveChessRequest', function (againstId) {
    if (socket.id === againstId){
      socket.emit('forgiveChessRequest');
    }else {
      socket.to(againstId).emit('forgiveChessRequest');
    }
  });

  socket.on('agreeForgiveChess', function (againstId) {
    if (socket.id === againstId){
      socket.emit('forgiveChessResult',true);
    }else {
      socket.to(againstId).emit('forgiveChessResult',true);
    }
  });
  socket.on('rejectForgiveChess', function (againstId) {
    if (socket.id === againstId){
      socket.emit('forgiveChessResult',false);
    }else {
      socket.to(againstId).emit('forgiveChessResult',false);
    }
  });

  socket.on('gameOver', function () {
    userList[socket.id].gameState = true;

    syncOnlineList();

  });

  socket.on('disconnect', function(){
    if (typeof(userList[socket.id]) !== "undefined" && !userList[socket.id].gameState){
      io.emit('runAway', socket.id);
    }
    delete userList[socket.id];
    syncOnlineList();
    console.log('user disconnected');
  });
});
