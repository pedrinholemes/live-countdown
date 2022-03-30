import {EventEmitter} from 'events'

export class CountDown extends EventEmitter {
  constructor(time = 30 * 60) {
    super()
    this.time = time;
    this.currentTime = time;
    this.interval = null;
    this.paused = false;
    this.started = false;
  }

  start() {
    if(this.started) return

    this.interval = setInterval(() => {
      if(!this.paused) {
        this.currentTime = this.currentTime - 1;
        this.emit('tick', {
          detail: {
            time: this.currentTime
          }
        })
        if(this.currentTime <= 0) {
          this.emit('end', {
            detail: {
              time: this.currentTime
            }
          })
          this.stop()
        }
      }
    }, 1000);
    this.started = true
  }

  pause() {
    if(!this.started) return
    this.paused = true
  }

  resume() {
    if(!this.started) return
    this.paused = false
  }

  stop() {
    clearInterval(this.interval)
    this.started = false
    this.interval = null
  }

  reset() {
    if(this.started) return
    this.currentTime = this.time
  }

  getHours() {
    return Math.floor(this.currentTime / 60)
  }

  getMinutes() {
    return Math.floor(this.currentTime / 60) % 60
  }

  getSeconds() {
    return Math.floor(this.currentTime / 100) % 60
  }

  getMilliseconds() {
    return this.currentTime % 100
  }

  getTime() {
    return this.currentTime
  }

  setTime(time) {
    this.time = time
    this.reset()
  }
}
