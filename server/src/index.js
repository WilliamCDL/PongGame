const express = require('express');
const app = express();
var db = require("./database.js")
const cors = require('cors');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { createRoom, getRooms, deleteRoom, RoomStatus, updateRoom, getRoomByName } = require('./rooms');
const { login } = require('./auth');
const { createUser, getUsers, findUserById } = require('./users.js');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

app.use(cors())

app.post('/api/login', (req, res) => login(req, res, io))
app.post('/api/users', createUser)
app.get('/api/users', getUsers)

app.all('*', (req, res) => {
  res.status(404).json({ "error": "Not found" });
})

// Socket IO

io.on('connection', (socket) => {

  // User logic
  let currentRoom;
  let haveUpdatedUsername = false;

  let username = 'anonymous';

  // When user connects, send username
  socket.on('username', (newUserName) => {
    if(haveUpdatedUsername) return;
    haveUpdatedUsername = true;
    
    username = newUserName;
    socket.nickname = newUserName;
    console.log('a user connected: (' + newUserName + ')');

    // When user enters the chat, send message to everyone
    io.emit('message', {
      username: 'system',
      message: `${username} entrou na sala`
    });
  });


  // Message logic

  // When user sends a message, send message to everyone
  socket.on('message', (message) => {
    console.log('message: ' + message);
    io.emit('message', {
      username,
      message
    });
  });



  // Room logic
  // When user enters the lobby, send rooms to this user
  socket.emit('rooms', getRooms());
  socket.on('get_rooms', () => {
    socket.emit('rooms', getRooms());
  });

  // When user creates a room, create room and send to everyone
  socket.on('create_room', (roomName) => {
    console.log('create_room: ' + roomName + ' by ' + username);
    currentRoom = createRoom(roomName, username);
    socket.join(roomName);
    socket.emit('room_created', currentRoom);
    socket.broadcast.emit('rooms', getRooms());

    let players = [];
    let roster = io.sockets.adapter.rooms.get(roomName);
    roster.forEach((socketId) => {
      players.push(io.sockets.sockets.get(socketId).nickname);
    });

    io.to(roomName).emit('room_status', {
      username: 'system',
      message: `${username} entrou na sala`,
      players
    });
  });

  socket.on('join_room', (roomName) => {
    socket.join(roomName);

    const room = getRoomByName(roomName);

    socket.emit('joined_room', room);

    let players = [];
    let roster = io.sockets.adapter.rooms.get(roomName);
    roster.forEach((socketId) => {
      players.push(io.sockets.sockets.get(socketId).nickname);
    });

    io.to(roomName).emit('room_status', {
      username: 'system',
      message: `${username} entrou na sala`,
      players
    });

    // When user joins a room and the game has already started, send started event
    currentRoom = room;
    if (room.status === RoomStatus.STARTED) {
      socket.emit('started', room);
    }
  });

  socket.on('get_room_status', (roomName) => {
    let players = [];
    let roster = io.sockets.adapter.rooms.get(roomName);
    roster.forEach((socketId) => {
      players.push(io.sockets.sockets.get(socketId).nickname);
    });

    socket.emit('room_status', {
      username: 'system',
      players
    });
  });

  socket.on('leave_room', (roomName) => {
    leaveRoom(io, socket, roomName, username);
  });

  // Gameplay logic
  socket.on('start_game', (roomName) => {
    console.log(roomName);
    let roster = Array.from(io.sockets.adapter.rooms.get(roomName));
    console.log(roster);

    if (roster.length < 2) {
      socket.emit('room_status', {
        username: 'system',
        message: `São necessários pelo menos 2 jogadores para iniciar o jogo.`
      })
      return;
    }

    const socketIdLeft = roster[0];
    const socketIdRight = roster[1];

    console.log(socketIdLeft);
    console.log(socketIdRight);

    const room = getRoomByName(roomName);
    console.log(room);
    room.status = RoomStatus.STARTED;
    room.players.left = io.sockets.sockets.get(socketIdLeft).nickname;
    room.players.right = io.sockets.sockets.get(socketIdRight).nickname;

    updateRoom(roomName, room);

    io.to(roomName).emit('started', room);

    socket.broadcast.emit('rooms', getRooms());
  });

  socket.on('y-left', (message) => {
    const roomName = message.roomName;
    socket.to(roomName).emit('y-left', message.value);
  })

  socket.on('y-right', (message) => {
    const roomName = message.roomName;
    socket.to(roomName).emit('y-right', message.value);
  })

  socket.on('game-state', (message) => {
    const roomName = message.roomName;
    socket.to(roomName).emit('game-state', message.value);
  })

  // When user disconnects, send message to everyone
  socket.on('disconnect', () => {
    if (currentRoom) {
      leaveRoom(io, socket, currentRoom.name, username);
      currentRoom = null;
    }

    io.emit('message', {
      username: 'system',
      message: `${username} saiu da sala`
    });
    console.log(`a user disconnected: (${username})`);
  })

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

function leaveRoom(io, socket, roomName, username) {
  try {
    console.log(roomName)
    const room = getRoomByName(roomName);
    console.log(room)
    if (!room) return;

    if (room.owner === username) {
      io.to(roomName).emit('room_status', {
        username: 'system',
        message: `Dono da sala deixou a sala. Sala será fechada em 5 segundos.`,
      });

      socket.leave(roomName);
      socket.emit('left_room');


      let roster = io.sockets.adapter.rooms.get(roomName);
      if (!roster) return;

      console.log(roster);

      setTimeout(() => {
        roster.forEach((socketId) => {
          const otherSocket = io.sockets.sockets.get(socketId);
          otherSocket.leave(roomName);
          otherSocket.emit('left_room');
        });

        deleteRoom(roomName);
        socket.broadcast.emit('rooms', getRooms());
      }, 5000);

      return;

    }

    if (room.players.right == username) {
      const room = getRoomByName(roomName);
      room.status = RoomStatus.CREATED;
      room.players.right = null;

      socket.to(roomName).emit('finished', room);
    }


    socket.leave(roomName);
    socket.emit('left_room');

    let players = [];
    let roster = io.sockets.adapter.rooms.get(roomName);
    roster.forEach((socketId) => {
      players.push(io.sockets.sockets.get(socketId).nickname);
    });

    io.to(roomName).emit('room_status', {
      username: 'system',
      message: `${username} saiu da sala`,
      players
    })

  } catch (e) {
    console.log(e);
  }
}
