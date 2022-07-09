import Scene from "../classes/Scene.js";
import Controller from "../classes/Controller.js";
import {Audio} from "../classes/Audio.js";
import {$app, $header, $play} from "../libs/elem.js";
import Game, {game} from "../Game.js";
import Entity from "../classes/Entity.js";
import collision from "../utils/collision.js";

class Header extends Scene {
    constructor() {
        super("#header", "playing");
    }

    static togglePlay() {
        if (!Game.playing) return;
        const animations = document.getAnimations();
        if (Game.props.paused) {
            Play.ctx.on();
            // Resume all not collided element anim.
            animations.filter(anim => !anim.effect["target"].collided).forEach(anim => anim.play());
            Audio.ctx.resume().then();
        } else {
            Play.ctx.off();
            animations.forEach(anim => anim.pause());
            Audio.ctx.suspend().then();
        }
        // Toggle paused status.
        Game.props.paused = !Game.props.paused;
        $header.pauseBtn.classList.toggle("unpause");
        $app.classList.toggle("paused");
    }

    setup() {
        this.scene.classList.add(this.className);
        // Btn controls.
        $header.pauseBtn.onclick = _ => Header.togglePlay();
        $header.muteBtn.onclick = _ => {
            if (Game.props.paused || !Game.playing) return;
            if (Game.props.muted) {
                Audio.setVolume();
            } else {
                Audio.setVolume(0);
            }
            Game.props.muted = !Game.props.muted;
            $header.muteBtn.classList.toggle("unmute");
        }
        $header.fontIncBtn.onclick = _ => {
            if (Game.props.paused || !Game.playing || Game.props.fontSize >= 24) return;
            this.scene.style.fontSize = `${++Game.props.fontSize}px`;
        }
        $header.fontDecBtn.onclick = _ => {
            if (Game.props.paused || !Game.playing || Game.props.fontSize <= 16) return;
            this.scene.style.fontSize = `${--Game.props.fontSize}px`;
        }
    }

    uninstall() {
        this.scene.classList.remove(this.className);
        // Reset header info.
        $header.fuel.value.innerText = 15;
        $header.fuel.fill.removeAttribute("style");
        $header.score.value.innerText = 0;
        $header.time.value.innerText = 0;
    }

    update() {
        if (Game.state.fuel > 30) {
            Game.state.fuel = 30;
        }
        $header.fuel.value.innerText = Game.state.fuel;
        $header.fuel.fill.style.height = `${Game.state.fuel / 30 * 32}px`;
        $header.score.value.innerText = Game.state.score;
        $header.time.value.innerText = Math.floor(Game.state.time);
    }
}

class Player {
    state = {
        up: false,
        left: false,
        right: false,
        down: false,
        fire: true,
        keyPause: true,
        step: 8,
    }
    _state = {...this.state}

    static on(obj, listener) {
        obj.onmousemove = _ => listener(true);
        obj.onmouseleave = _ => listener(false);
    }

    static goto({cond, position, steps, max}) {
        if (cond) $play.player.style[position] = `${steps}px`;
        if (max.cond) $play.player.style[position] = `${max.steps}px`;
    }

    #move() {
        const maxWidth = $play.box.offsetWidth - $play.player.offsetWidth;
        const maxHeight = $play.box.offsetHeight - $play.player.offsetHeight;
        Player.goto({
            cond: this.state.up,
            position: "top",
            steps: $play.player.offsetTop - this.state.step,
            max: {
                cond: $play.player.offsetTop <= 0,
                steps: 0,
            }
        });
        Player.goto({
            cond: this.state.left,
            position: "left",
            steps: $play.player.offsetLeft - this.state.step,
            max: {
                cond: $play.player.offsetLeft <= 0,
                steps: 0,
            }
        });
        Player.goto({
            cond: this.state.right,
            position: "left",
            steps: $play.player.offsetLeft + this.state.step,
            max: {
                cond: $play.player.offsetLeft >= maxWidth,
                steps: maxWidth,
            }
        });
        Player.goto({
            cond: this.state.down,
            position: "top",
            steps: $play.player.offsetTop + this.state.step,
            max: {
                cond: $play.player.offsetTop >= maxHeight,
                steps: maxHeight,
            },
        });
    }

    #collider() {
        // Player collision listener.
        collision(
            $play.player,
            [
                ...Entity.getAsteroid(),
                ...Entity.getFuel(),
                ...Entity.getEnemy(),
                ...Entity.getEnemyBullet(),
            ],
            (target, entity) => entity.collidedFn(target, entity)
        );
        // Player bullet collision listener.
        Entity.getBullet().forEach(bullet => collision(
            bullet,
            [
                ...Entity.getAsteroid(),
                ...Entity.getEnemy(),
                ...Entity.getEnemyBullet(),
                ...Entity.getFriend(),
            ],
            (target, entity) => {
                target.destroy();
                entity.collidedFn(target, entity);
            }
        ));
    }

    #bullets() {
        // Bullets moving.
        [
            ...Entity.getBullet(),
            ...Entity.getEnemyBullet(),
        ].forEach(bullet => {
            bullet.style.left = `${bullet.offsetLeft + bullet.direction}px`;
            // Max move range.
            if (
                bullet.offsetLeft < -bullet.offsetWidth ||
                bullet.offsetLeft > $play.box.offsetWidth
            ) {
                bullet.remove();
            }
        });
        // Random fire enemy bullet.
        Entity.getEnemy().forEach(entity => {
            // Init last fire timestamp.
            if (!entity.lastTime) entity.lastTime = Play.ctx.currTime;
            if (Play.ctx.currTime > entity.lastTime + entity.nextTime) {
                // Fire enemy bullet.
                Entity.createBullet(entity);
                // Update last fire timestamp.
                entity.lastTime = Play.ctx.currTime;
                // Refresh bullet fire cool-down.
                entity.next();
            }
        });
    }

    update() {
        // Player moving listener.
        this.#move();
        // Player collision listener.
        this.#collider();
        // Bullet related handler.
        this.#bullets();
    }

    setup() {
        // Init joystick event.
        Player.on($play.toUp, value => this.state.up = value);
        Player.on($play.toLeft, value => this.state.left = value);
        Player.on($play.toRight, value => this.state.right = value);
        Player.on($play.toDown, value => this.state.down = value);
        document.onkeydown = ev => {
            if (!Game.playing) return;
            if (this.state.keyPause && ev.code === "KeyP") {
                // Pause/Play game.
                this.state.keyPause = false;
                Header.togglePlay();
            } else if (
                !Game.props.paused &&
                this.state.fire &&
                ev.code === "Space"
            ) {
                // Fire bullet.
                this.state.fire = false;
                Entity.createBullet($play.player);
            }
        }
        document.onkeyup = _ => {
            this.state.fire = true;
            this.state.keyPause = true;
        }
    }

    uninstall() {
        // Reset player state.
        for (const key in this.state) {
            this.state[key] = this._state[key];
        }
        // Destroy all event.
        document.onkeydown = document.onkeyup = null;
        $play.toUp.onmousemove = $play.toUp.onmouseleave = null;
        $play.toLeft.onmousemove = $play.toLeft.onmouseleave = null;
        $play.toRight.onmousemove = $play.toRight.onmouseleave = null;
        $play.toDown.onmousemove = $play.toDown.onmouseleave = null;
    }
}

export default class Play extends Scene {
    #header = new Header();
    #player = new Player();
    #controller = new Controller(ctx => {
        if (Game.state.fuel <= 0) {
            // Reset time.
            ctx.prevTime = ctx.currTime = 0;
            game.next();
            return;
        }
        // Set interval loop callbacks.
        this.interval = ctx.setInterval(this.interval, 1000, _ => {
            Entity.createEntity();
            Game.state.fuel--;
        });
        // Increment gaming time.
        Game.state.time = ctx.currTime / 1000;
        // Update player events.
        this.#player.update();
        // Update header statusbar.
        this.#header.update();
    });

    constructor() {
        super("#play");
    }

    mount() {
        super.setup();
        this.#header.setup();
        this.#player.setup();
        Audio.state.background.start();
        // Delay exec handler, player anim duration set.
        setTimeout(_ => {
            this.#controller.on();
            // controller context.
            Play.ctx = this.#controller;
            this.interval = {};
            // Set playing flag.
            Game.playing = Date.now();
        }, 2000);
    }

    unmount() {
        super.uninstall();
        this.#controller.off();
        this.#header.uninstall();
        this.#player.uninstall();
        $play.box.innerHTML = "";
        $play.player.removeAttribute("style");
        // Removed interval setting.
        delete this.interval;
        Game.playing = null;
    }
}
