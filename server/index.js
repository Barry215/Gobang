let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

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

  socket.on('inviteGame', function (againstId) {
    if (socket.id === againstId){
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
    console.log('user disconnected');
  });
});
