import Scene from '../classes/Scene'
import { Audio } from '../classes/Audio'
import { $over } from '../libs/elem'
import Game, { game } from '../Game'

export default class Over extends Scene {
  constructor() {
    super('#over')
  }

  state = {
    name: '',
  }
  _state = { ...this.state }

  mount() {
    super.setup()
    Audio.state.background.stop()
    $over.playerName.oninput = (ev) => {
      const val = ev.target.value.trim()
      // trim invalid space char
      this.state.name = val
      $over.continueBtn.disabled = !val.length
    }
    $over.continueBtn.addEventListener(
      'click',
      () => {
        const tempData = {
          name: this.state.name,
          score: Game.state.score,
          // Save a integer.
          time: Math.floor(Game.state.time),
        }
        if (localStorage.getItem('star_battle_gameData')) {
          const getData = JSON.parse(localStorage.getItem('star_battle_gameData'))
          localStorage.setItem('star_battle_gameData', JSON.stringify([tempData, ...getData]))
        } else {
          localStorage.setItem('star_battle_gameData', JSON.stringify([tempData]))
        }
        game.next()
      },
      {
        once: true,
      }
    )
  }

  unmount() {
    super.uninstall()
    for (const key in this.state) {
      this.state[key] = this._state[key]
    }
    $over.playerName.oninput = null
    $over.playerName.value = ''
    $over.continueBtn.disabled = true
  }
}
