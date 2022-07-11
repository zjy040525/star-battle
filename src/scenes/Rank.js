import Scene from "../classes/Scene";
import { $rank } from "../libs/elem";
import { game } from "../Game";

export default class Rank extends Scene {
  constructor() {
    super("#rank");
  }

  mount() {
    super.setup();
    let rank = 0;
    let tempRank = 0;
    JSON.parse(localStorage.getItem("star_battle_gameData"))
      .sort((a, b) => {
        if (b.score < a.score) {
          return b.score - a.score;
        } else if (b.score === a.score && b.time < a.time) {
          return b.time - a.time;
        }
      })
      .slice(0, 10)
      .forEach((value, index, array) => {
        const curr = value;
        const prev = array[index - 1];
        const elem = document.createElement("li");
        // compare rank.
        if (curr.score !== prev?.score) {
          rank = tempRank + 1;
        } else if (curr.time < prev?.time) {
          rank = tempRank + 1;
        }
        tempRank++;
        const rankItem = [
          rank,
          ...Object.keys(curr).map((index) => curr[index]),
        ];
        // each all rank item.
        for (let i = 0; i < rankItem.length; i++) {
          const spanElement = document.createElement("span");
          spanElement.innerText = rankItem[i];
          elem.appendChild(spanElement);
        }
        $rank.rankList.appendChild(elem);
      });
    $rank.replayBtn.addEventListener(
      "click",
      () => {
        game.next();
      },
      {
        once: true,
      }
    );
  }

  unmount() {
    super.uninstall();
    $rank.rankList.innerHTML = "";
  }
}
