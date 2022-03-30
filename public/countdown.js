export class CountDown {
  constructor(time = 30 * 60) {
    this.currentTime = time;
  }

  getHours() {
    return Math.floor(this.currentTime / 60 / 60)
  }

  getMinutes() {
    return Math.floor(this.currentTime / 60) % 60
  }

  getSeconds() {
    return Math.floor(this.currentTime) % 60
  }

  getTime() {
    return this.currentTime
  }
}
