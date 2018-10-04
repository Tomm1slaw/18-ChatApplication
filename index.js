const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const UsersService = require('./UsersService');

const usersService = new UsersService();

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// user join to server
io.on('connection', (socket) => {
    socket.on('join', (name) => {
        userService.addUser({
            id: socket.id,
            name
        });
// update user list
        io.emit('update', {
            users: userService.getAllUsers()
        });
    });
});

// user disconnect with server
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    usersService.removeUser(socket.id);
// update user list
    socket.broadcast.emit('update', {
      users: usersService.getAllUsers()
    });
  });
});

// user send a message
io.on('connection', (socket) => {
  socket.on('message', (message) => {
    const {name} = usersService.getUserById(socket.id);
    socket.broadcast.emit('message', {
      text: message.text,
      from: name
    });
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});