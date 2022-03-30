import { socket } from './socket.js'
import { CountDown } from './countdown.js'
import { render } from './render.js'

const minutesInput = document.querySelector('input#min')
const secondsInput = document.querySelector('input#sec')

const setTimeButton = document.querySelector('#set-time button')
const startAndStopButton = document.querySelector('#start-stop button')
const pauseAndResumeButton = document.querySelector('#pause-resume button')
const resetButton = document.querySelector('#reset button')
const reloadButton = document.querySelector('#reload button')

const state = {
  isStarted: false,
  isPaused: false,
}

socket.on('pause-countdown', () => {
  state.isPaused = true
  renderButtons()
})
socket.on('resume-countdown', () => {
  state.isPaused = false
  renderButtons()
})
socket.on('start-countdown', () => {
  state.isStarted = true
  renderButtons()
})
socket.on('stop-countdown', () => {
  state.isStarted = false
  renderButtons()
})

socket.onAny((_, data) => {
  if (data) {
    if (data.state) {
      state.isPaused = data.state.isPaused
      state.isStarted = data.state.isStarted
    }
    if (data.time && typeof data.time === 'number') {
      render(new CountDown(data.time))
    }
  }
  renderButtons()
})

setTimeButton.addEventListener('click', () => {
  socket.emit('set-time-countdown', {
    newTime: Number(minutesInput.value) * 60 + Number(secondsInput.value)
  })
})

startAndStopButton.addEventListener('click', () => {
  if(state.isStarted) {
    socket.emit('stop-countdown')
  } else {
    socket.emit('start-countdown')
  }
})

reloadButton.addEventListener('click', () => {
  socket.emit('reload')
})

pauseAndResumeButton.addEventListener('click', () => {
  if(state.isPaused) {
    socket.emit('resume-countdown')
  } else {
    socket.emit('pause-countdown')
  }
})

resetButton.addEventListener('click', () => {
  socket.emit('reset-countdown')
})

function renderButtons() {
  if(state.isPaused) pauseAndResumeButton.textContent = 'Continuar contagem regressiva'
  else pauseAndResumeButton.textContent = 'Pausar contagem regressiva'

  if(state.isStarted) startAndStopButton.textContent = 'Parar contagem regressiva'
  else startAndStopButton.textContent = 'Iniciar Contagem regressiva'

  if(state.isStarted) {
    pauseAndResumeButton.disabled = false
    resetButton.disabled = true
    startAndStopButton.disabled = true
    if(state.isPaused) {
      startAndStopButton.disabled = false
      resetButton.disabled = false
    }
  } else {
    pauseAndResumeButton.disabled = true
    resetButton.disabled = false
  }
}
