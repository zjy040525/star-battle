import Start from './scenes/Start'
import Play from './scenes/Play'
import Over from './scenes/Over'
import Rank from './scenes/Rank'

class Game {
  #scenes
  #keys
  #curr
  #prev

  constructor() {
    // Init all scenes.
    this.#scenes = {
      start: new Start(),
      play: new Play(),
      over: new Over(),
      rank: new Rank(),
    }
    this.#keys = Object.keys(this.#scenes)
    this.#curr = 0
  }

  // game playing flag.
  static playing = null

  // Gaming global state.
  static state = {
    fuel: 15,
    score: 0,
    time: 0,
  }

  // State default value.
  static _state = { ...this.state }

  // Game global controls.
  static props = {
    muted: false,
    paused: false,
    fontSize: 16,
  }

  next() {
    // Uninstall previous scene.
    this.#scenes[this.#keys[this.#prev]]?.unmount()
    // Install current scene.
    this.#scenes[this.#keys[this.#curr]].mount()
    // Refresh prev index.
    this.#prev = this.#curr
    // Reset game process.
    if (this.#curr === this.#keys.length - 1) {
      this.#curr = 0
      // Reset game global state.
      for (const key in Game.state) {
        Game.state[key] = Game._state[key]
      }
    } else {
      // Increment curr index.
      this.#curr++
    }
  }
}

export default Game
export const game = new Game()
