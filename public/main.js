import { CountDown } from './countdown.js'
import { render } from './render.js'
import { socket } from './socket.js'

socket.on('tick', data => {
  render(new CountDown(data.time))
})

window.addEventListener('dblclick', () => {
  // must be toggle fullscreen
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
  else {
    document.documentElement.requestFullscreen()
  }
})

document.querySelector('#dark-mode')?.addEventListener('click', () => {
  document.body.classList.toggle('dark')
})
