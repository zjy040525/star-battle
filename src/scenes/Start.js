import Scene from '../classes/Scene'
import initAudioClasses from '../classes/Audio'
import { $start } from '../libs/elem'
import { game } from '../Game'
import rnd from '../utils/rnd'

// Start scene, default show pages.
export default class Start extends Scene {
  constructor() {
    super('#start')
  }

  mount() {
    super.setup()
    // main handler.
    $start.startBtn.addEventListener(
      'click',
      () => {
        // Init audio classes.
        initAudioClasses()
        game.next()
      },
      // clicked removed event.
      { once: true }
    )
    // Random load preview planet image.
    $start.previewImage.src = `/common/images/planets/big${rnd(0, 4)}.png`
  }

  unmount() {
    super.uninstall()
  }
}
