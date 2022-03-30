console.clear()

import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from "socket.io";
import { CountDown } from './lib/countdown.js';
import chalk from 'chalk';
import ip from 'ip'
import fs from 'fs'

const resolvePath = (...paths) => path.resolve(process.cwd(), ...paths)

const app = express();
const server = createServer(app);
const io = new Server(server);

const configData = fs.readFileSync(resolvePath('config.json'), 'utf8')
const config = Object.freeze(JSON.parse(configData))


const users = {}

const cd = new CountDown()

cd.on('tick', () => {
  tickTo(io)
})

cd.on('end', () =>{
  console.log(
    chalk.blueBright('[countdown] ') + 'terminou'
  )
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
  socket.onAny((event) => {
    console.log(chalk.magentaBright('[socket]') + ' evento: ' + chalk.bold(event) + ' emitido por: ' + chalk.bold(socket.id))
  })

  users[socket.id] = {
    id: socket.id,
    disconnected: false
  }

  socket.on('handshake', data => {
    console.log(chalk.magentaBright('[socket]') + ' novo cliente: ' + chalk.bold(socket.id) + ' conectado como: ' + chalk.bold(data.path))

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
    console.log(chalk.magentaBright('[socket]') + ' cliente desconectado: ' + chalk.bold(socket.id))
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
app.get('/', (_, res) => res.sendFile(resolvePath('index.html')));
app.get('/countdown', (_, res) => res.sendFile(resolvePath('countdown.html')));
app.get('/admin', (_, res) => res.sendFile(resolvePath('admin.html')));

const PORT = process.env.PORT || config.port || 3000

function formatServerURL(host) {
  return chalk.bold('http://' + host + (PORT === 80 ? '' : ':' + PORT) + '/')
}

server.listen(PORT, () => {
  const address = ip.address()
  console.log(chalk.greenBright('[servidor]') + ' ouvindo porta ' + chalk.bold(PORT));
  console.log(chalk.greenBright('[servidor]') + ' acesse em:')
  config.hosts.map(host => {
    if(host === '::local_ip') host = address
  
    console.log('           - ' + formatServerURL(host))
  })
})
