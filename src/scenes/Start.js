import Scene from "../classes/Scene.js";
import initAudioClasses from "../classes/Audio.js";
import { $start } from "../libs/elem.js";
import { game } from "../Game.js";
import rnd from "../utils/rnd.js";

export default class Start extends Scene {
  constructor() {
    super("#start");
    $start.previewImage.src = `./src/assets/images/planets/big${rnd(0, 4)}.png`;
  }

  mount() {
    super.setup();
    // main handler.
    $start.startBtn.addEventListener(
      "click",
      (_) => {
        // Init audio classes.
        initAudioClasses();
        game.next();
      },
      {
        once: true,
      }
    );
    // Random load preview planet image.
    $start.previewImage.src = `./src/assets/images/planets/big${rnd(0, 4)}.png`;
  }

  unmount() {
    super.uninstall();
  }
}
