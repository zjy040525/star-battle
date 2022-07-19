import rnd from "../utils/rnd";
import Animation from "./Animation";
import Game from "../Game";
import { Audio } from "./Audio";
import isBullet from "../utils/isBullet";
import isPlayer from "../utils/isPlayer";
import { $header, $play } from "../libs/elem";

export default class Entity {
  static asteroidColors = [
    ["#9a6a33", "#8a551e", "#7e4e17", "#906029"],
    ["#9c9c9c", "#918d8d", "#888888", "#919191"],
    ["#868686", "#818181", "#6a6868", "#7b7b7b"],
    ["#868686", "#7c7979", "#6a6868", "#7b7b7b"],
  ];
  static enemyColors = [
    ["#9fcfee", "#64ad48", "#006838", "#009444", "#ffffff"],
    ["#0f52b7", "#cdcbc7", "#c9fcfe", "#fd8731", "#93d52f", "#facb79", "#e34941", "#fcfec8"],
    ["#e8e8e7", "#6d6d66", "#862747", "#f8ac82", "#e14940", "#fbe786"],
  ];
  static entities = [
    {
      className: "fuel",
      start: {
        x: (el) => rnd(0, $play.box.offsetWidth - el.offsetWidth),
        y: (el) => -el.offsetHeight,
      },
      end: {
        x: (el) => rnd(0, $play.box.offsetWidth - el.offsetWidth),
        y: () => $play.box.offsetHeight,
      },
      duration: [9000, 16000],
      collidedFn(_target, elem) {
        Game.state.fuel += 15;
        Animation.zoom($header.fuel.icon);
        elem.remove();
      },
    },
    {
      className: "asteroid",
      start: {
        x: () => $play.box.offsetWidth,
        y: (el) => rnd(0, $play.box.offsetHeight - el.offsetHeight),
      },
      end: {
        x: (el) => -el.offsetWidth,
      },
      duration: [9000, 16000],
      provide(elem) {
        const index = rnd(0, 3);
        elem.hitCount = 0;
        elem.colors = this.asteroidColors[index];
        elem.style.width = elem.style.height = `${rnd(110, 130)}px`;
        elem.style.backgroundImage = `url("/common/images/asteroids/${index}.png")`;
        elem.destroy = () => {
          Animation.burst(elem);
          Audio.state.destroyed.start(true);
        };
      },
      collidedFn(target, elem) {
        if (isPlayer(target)) {
          Game.state.fuel -= 15;
          Animation.zoom($header.fuel.icon);
          elem.destroy();
        } else if (isBullet(target) && ++elem.hitCount === 2) {
          Game.state.score += 10;
          Animation.zoom($header.score.icon);
          elem.destroy();
        }
      },
    },
    {
      className: "friend",
      start: {
        x: () => $play.box.offsetWidth,
        y: (el) => rnd(0, $play.box.offsetHeight - el.offsetHeight),
      },
      end: {
        x: (el) => -el.offsetWidth,
      },
      duration: [9000, 16000],
      provide(elem) {
        elem.colors = ["#ccccca", "#fbd33b", "#ffffff", "#fbb03b"];
      },
      collidedFn(target, elem) {
        if (isBullet(target)) {
          Game.state.score -= 10;
          Animation.zoom($header.score.icon);
        }
        Animation.burst(elem);
        Audio.state.destroyed.start(true);
      },
    },
    {
      className: "enemy",
      start: {
        x: () => $play.box.offsetWidth,
        y: (el) => rnd(0, $play.box.offsetHeight - el.offsetHeight),
      },
      end: {
        x: (el) => -el.offsetWidth,
      },
      duration: [9000, 16000],
      provide(elem) {
        const index = rnd(0, 2);
        elem.next = () => (elem.nextTime = rnd(1500, 3000));
        // Refresh bullet fire cool-down.
        elem.next();
        elem.colors = this.enemyColors[index];
        elem.style.backgroundImage = `url("/common/images/enemies/enemy${index}.gif")`;
      },
      collidedFn(target, elem) {
        if (isPlayer(target)) {
          Game.state.fuel -= 15;
          Animation.zoom($header.fuel.icon);
        } else if (isBullet(target)) {
          Game.state.score += 5;
          Animation.zoom($header.score.icon);
        }
        Animation.burst(elem);
        Audio.state.destroyed.start(true);
      },
    },
    {
      className: "big-planet",
      start: {
        x: () => $play.box.offsetWidth,
        y: (el) => rnd(0, $play.box.offsetHeight - el.offsetHeight),
      },
      end: {
        x: (el) => -el.offsetWidth,
      },
      duration: [5000, 8000],
      provide(elem) {
        elem.style.width = elem.style.height = `${rnd(140, 160)}px`;
        elem.style.backgroundImage = `url("/common/images/planets/big${rnd(0, 5)}.png")`;
      },
    },
    {
      className: "small-planet",
      start: {
        x: () => $play.box.offsetWidth,
        y: (el) => rnd(0, $play.box.offsetHeight - el.offsetHeight),
      },
      end: {
        x: (el) => -el.offsetWidth,
      },
      duration: [9000, 12000],
      provide(elem) {
        elem.style.width = elem.style.height = `${rnd(40, 60)}px`;
        elem.style.backgroundImage = `url("/common/images/planets/small${rnd(0, 5)}.png")`;
      },
    },
  ];

  static createEntity() {
    const {
      className,
      duration: [min, max],
      start,
      end,
      provide,
      collidedFn,
    } = this.entities[rnd(0, this.entities.length - 1)];
    const elem = document.createElement("span");
    // Append to entity container.
    $play.box.appendChild(elem);
    // entity class name config.
    elem.classList.add(className);
    provide?.call(Entity, elem);
    elem.collidedFn = collidedFn;
    Animation.move(elem, start, end, rnd(min, max));
  }

  static createBullet(deps) {
    const elem = document.createElement("span");
    if (isPlayer(deps)) {
      elem.colors = ["#401D7E", "#6678FC", "#6596FF", "#555AB6"];
      elem.classList.add("player-bullet");
      elem.direction = 18;
      Audio.state.shoot.start(true);
    } else {
      elem.colors = ["#A00095", "#FA00FC", "#A108B5", "#5E1674"];
      elem.classList.add("enemy-bullet");
      elem.direction = -6;
    }
    // Destroy enemy bullet, burst anim, default burst direction is left.
    elem.destroy = (offset = [-40, -90]) => {
      Animation.burst(elem, {
        amount: [3, 6],
        size: [5, 5],
        offset,
        duration: [250, 500],
      });
    };
    elem.collidedFn = (target, entity) => {
      if (isPlayer(target)) {
        Game.state.fuel -= 15;
        Animation.zoom($header.fuel.icon);
      }
      // Enemy bullet reverse burst.
      entity.destroy([40, 90]);
    };
    // Spawn point.
    elem.style.left = `${deps.offsetLeft}px`;
    elem.style.top = `${deps.offsetTop + deps.offsetHeight / 2}px`;
    // bullet append to entity container.
    $play.box.appendChild(elem);
  }

  static getFuel() {
    return [...$s("#box .fuel")];
  }

  static getAsteroid() {
    return [...$s("#box .asteroid")].filter((entity) => !entity.collided);
  }

  static getFriend() {
    return [...$s("#box .friend")].filter((entity) => !entity.collided);
  }

  static getEnemy() {
    return [...$s("#box .enemy")].filter((entity) => !entity.collided);
  }

  static getBullet() {
    return [...$s("#box .player-bullet")].filter((bullet) => !bullet.collided);
  }

  static getEnemyBullet() {
    return [...$s("#box .enemy-bullet")].filter((bullet) => !bullet.collided);
  }
}
