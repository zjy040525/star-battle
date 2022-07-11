import Scene from "../classes/Scene";
import initAudioClasses from "../classes/Audio";
import { $start } from "../libs/elem";
import { game } from "../Game";
import rnd from "../utils/rnd";

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
