// Throttling requestAnimationFrame to FPS.
const interval = 1000 / 60

export default class Listener {
  constructor(callback) {
    this.prevTime = 0
    this.callback = callback
  }

  #animate(timestamp) {
    this.rAF = requestAnimationFrame((timestamp) => this.#animate(timestamp))
    // Calc elapsed time since last loop.
    this.now = timestamp
    this.elapsed = this.now - this.then
    // If enough time has elapsed, draw the next frame.
    if (this.elapsed > interval) {
      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67.
      this.then = this.now - (this.elapsed % interval)
      // Record how long this instance has been running.
      this.currTime = this.prevTime + Math.round(this.now - this.startTime)
      // handler...
      this.callback?.(this, timestamp)
    }
  }

  setInterval(state, ms, callback) {
    if (!state?.tick) {
      state = {
        tick: this.currTime,
      }
    } else if (this.currTime > state.tick + ms) {
      callback()
      // Reset interval time.
      state.tick = this.currTime
    }
    return state
  }

  on() {
    // Init timestamp info.
    this.then = window.performance.now()
    this.startTime = this.then
    // Start animate callbacks.
    this.#animate()
  }

  off() {
    // Cancel animate callbacks.
    cancelAnimationFrame(this.rAF)
    // Save paused before running times.
    this.prevTime = this.currTime
    // Reset timestamp info.
    this.then = window.performance.now()
    this.startTime = this.then
  }
}
