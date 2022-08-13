let Audio = class {
  // Expose Audio to the outside.
}
// Use a function to declare the audio class to resolve the warning in the browser console.
const initAudioClasses = () => {
  if (Audio.ctx) return
  // Create global audio context.
  const aCtx = new AudioContext()
  // aCtx global volume controls.
  const gainNode = aCtx.createGain()
  // Default volume value.
  gainNode.gain.value = 0.25
  // Connect aCtx destination.
  gainNode.connect(aCtx.destination)
  Audio = class {
    src = aCtx.createBufferSource()
    static ctx = aCtx

    static setVolume(value = 0.25) {
      gainNode.gain.value = value
    }

    constructor(filename, audioConfig) {
      this.audioConfig = audioConfig
      this.audio = fetch(`/common/sounds/${filename}`)
        .then(res => res.arrayBuffer())
        .then(buf => aCtx.decodeAudioData(buf))
        .then(decoded => {
          this.src.buffer = this.tempBuffer = decoded
          // connected gain node.
          this.src.connect(gainNode)
          this.audioConfig?.(this.src)
        })
    }

    #createBufferSource() {
      // Recreate audio buffer.
      this.src = aCtx.createBufferSource()
      // save buffer of tempBuffer.
      this.src.buffer = this.tempBuffer
      // Link to gainNode, volume.
      this.src.connect(gainNode)
      // Audio extra configurations.
      this.audioConfig?.(this.src)
    }

    start(repeat) {
      this.audio.then(() => {
        // Play audio.
        this.src.start()
        if (repeat) {
          // recreate audio source of Audio Classes.
          this.#createBufferSource()
        }
      })
    }

    stop() {
      this.audio.then(() => {
        // Stopped audio.
        this.src.stop()
        this.#createBufferSource()
      })
    }
  }
  // Init all audios.
  Audio.state = {
    // playing state.
    background: new Audio('background.mp3', audio => (audio.loop = true)),
    // asteroid/enemy/friend dropped audio.
    destroyed: new Audio('destroyed.mp3'),
    // fire bullet audio.
    shoot: new Audio('shoot.mp3'),
  }
}

export { Audio }
export default initAudioClasses
