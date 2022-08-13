window.$ = (selector) => document.querySelector(selector)
window.$s = (selector) => document.querySelectorAll(selector)

export default class Scene {
  constructor(selector, className) {
    // Get scene.
    this.scene = $(selector)
    // Set scene toggle className.
    this.className = className || 'hidden'
  }

  setup() {
    this.scene.classList.remove(this.className)
  }

  uninstall() {
    this.scene.classList.add(this.className)
  }
}
