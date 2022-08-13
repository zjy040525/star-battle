import rnd from '../utils/rnd'
import { rotate, translate } from '../utils/styles'

export default class Animation {
  static #easing = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']

  static move(entity, start, end, duration) {
    const easing = this.#easing[rnd(0, this.#easing.length - 1)]
    const [x, y] = [start.x(entity), start.y(entity)]
    entity.style.left = `${x}px`
    entity.style.top = `${y}px`
    entity
      .animate(
        {
          left: `${end.x ? end.x(entity) : x}px`,
          top: `${end.y ? end.y(entity) : y}px`,
        },
        {
          duration,
          easing,
        }
      )
      .finished.then(() => entity.remove())
  }

  static zoom(obj) {
    obj.animate(
      {
        transform: ['scale(1)', 'scale(1.5)', 'scale(1)'],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
      }
    )
  }

  static burst(
    entity,
    burstConfig = {
      amount: [8, 20],
      size: [4, 12],
      offset: [80, 160],
      duration: [500, 2000],
    }
  ) {
    const getAnim = entity.getAnimations()
    const animQueue = []
    const { amount, size, offset, duration } = burstConfig
    // Cancel all animations.
    getAnim.filter((anim) => anim instanceof CSSAnimation).forEach((anim) => anim.cancel())
    getAnim.forEach((anim) => anim.pause())
    entity.collided = true
    entity.style.backgroundImage = 'none'
    for (let i = 0; i < rnd(amount[0], amount[1]); i++) {
      const particle = document.createElement('span')
      const s = rnd(size[0], size[1])
      particle.style.width = particle.style.height = `${s}px`
      particle.style.left = particle.style.top = `calc(50% - ${s / 2}px)`
      particle.style.borderRadius = `${rnd(8, 50)}%`
      particle.style.backgroundColor = entity.colors[rnd(0, entity.colors.length - 1)]
      entity.appendChild(particle)
      const w = entity.offsetWidth / 2 - particle.offsetWidth / 2
      const h = entity.offsetHeight / 2 - particle.offsetHeight / 2
      particle.style.transform = translate(rnd(-w, w), rnd(-h, h)) + rotate(rnd(0, 360))
      const [oMin, oMax] = offset
      const [dMin, dMax] = duration
      animQueue.push(
        particle
          .animate(
            {
              opacity: [1, 0],
              transform: [translate(rnd(oMin, oMax), rnd(-40, 40)) + rotate(rnd(0, 360))],
            },
            {
              duration: rnd(dMin, dMax),
              easing: 'ease-out',
            }
          )
          .finished.then(() => {
            particle.remove()
            return Promise.resolve()
          })
      )
    }
    Promise.all(animQueue).then(() => entity.remove())
  }
}
