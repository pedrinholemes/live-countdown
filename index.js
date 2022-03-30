import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from "socket.io";
import { CountDown } from './lib/countdown.js';

const resolvePath = (...paths) => path.resolve(process.cwd(), ...paths)

const app = express();
const server = createServer(app);
const io = new Server(server);

const users = {}

const cd = new CountDown()

cd.on('tick', () => {
  tickTo(io)
})

function tickTo(socket) {
  socket.emit('tick', {
    time: cd.currentTime,
    state: {
      isPaused: cd.paused,
      isStarted: cd.started
    }
  })
}

io.on('connection', (socket) => {
  console.log('New client connected with id: ' + socket.id);

  users[socket.id] = {
    id: socket.id,
    disconnected: false
  }

  socket.on('handshake', data => {
    users[socket.id] = {
      ...users[socket.id],
      id: socket.id,
      data
    }
  })

  tickTo(socket)

  socket.on('reload', () => {
    io.emit('reload-page')
  })
  socket.on('start-countdown', () => {
    if(cd.started) return
    cd.start();
    io.emit('start-countdown');
  })
  socket.on('pause-countdown', () => {
    if(cd.paused || !cd.started) return
    cd.pause();
    io.emit('pause-countdown');
  })
  socket.on('resume-countdown', () => {
    if(!cd.paused || !cd.started) return
    cd.resume();
    io.emit('resume-countdown');
  })
  socket.on('stop-countdown', () => {
    if(!cd.started) return
    cd.stop();
    io.emit('stop-countdown');
  })
  socket.on('reset-countdown', () => {
    if(cd.started) return
    cd.reset();
    io.emit('reset-countdown');
    tickTo(io)
  })
  socket.on('set-time-countdown', data => {
    if(cd.started) return
    cd.setTime(Number(data.newTime));
    io.emit('set-time-countdown', { newTime: cd.currentTime });
    tickTo(io)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected with id: ' + socket.id);
    users[socket.id] = {
      ...users[socket.id],
      disconnected: true
    }

    setTimeout(() => {
      if(users[socket.id].disconnected) {
        delete users[socket.id]
      }
    }, 3000)
  });
});

app.use('/public', express.static('public'));
app.get('/', (_, res) => {
  res.setHeader('Local-IP', _.ip)
  res.sendFile(resolvePath('index.html'))
});
app.get('/admin', (_, res) => {
  res.setHeader('Local-IP', _.ip)
  res.sendFile(resolvePath('admin.html'))
});

app.get('/clients', (_, res) => {
  res.json(users)
})

server.listen(3000, () => {
  console.log("HTTPS Server running in 3000 port")
})
