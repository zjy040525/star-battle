let Audio = class {
  // Expose Audio to the outside.
};
// Use a function to declare the audio class to resolve the warning in the browser console.
const initAudioClasses = (_) => {
  if (Audio.ctx) return;
  // Create global audio context.
  const aCtx = new AudioContext();
  // aCtx global volume controls.
  const gainNode = aCtx.createGain();
  // Default volume value.
  gainNode.gain.value = 0.25;
  // Connect aCtx destination.
  gainNode.connect(aCtx.destination);
  Audio = class {
    src = aCtx.createBufferSource();
    static ctx = aCtx;

    static setVolume(value = 0.25) {
      gainNode.gain.value = value;
    }

    constructor(filename, audioConfig) {
      this.audioConfig = audioConfig;
      this.audio = fetch(`./src/assets/sounds/${filename}`)
        .then((res) => res.arrayBuffer())
        .then((buf) => aCtx.decodeAudioData(buf))
        .then((decoded) => {
          this.src.buffer = this.tempBuffer = decoded;
          // connected gain node.
          this.src.connect(gainNode);
          this.audioConfig?.(this.src);
        });
    }

    #createBufferSource() {
      // Recreate audio buffer.
      this.src = aCtx.createBufferSource();
      this.src.buffer = this.tempBuffer;
      this.src.connect(gainNode);
      this.audioConfig?.(this.src);
    }

    start(repeat) {
      this.audio.then((_) => {
        // Play audio.
        this.src.start();
        if (repeat) {
          this.#createBufferSource();
        }
      });
    }

    stop() {
      this.audio.then((_) => {
        // Stopped audio.
        this.src.stop();
        this.#createBufferSource();
      });
    }
  };
  // Init all audios.
  Audio.state = {
    background: new Audio("background.mp3", (audio) => (audio.loop = true)),
    destroyed: new Audio("destroyed.mp3"),
    shoot: new Audio("shoot.mp3"),
  };
};

export { Audio };
export default initAudioClasses;
