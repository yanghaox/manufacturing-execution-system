export default class FnChain {
  constructor(fn) {
    this.fn = fn
    this.nextFnChain = null
  }

  setNextFnChain(nextFnChain) {
    this.nextFnChain = nextFnChain
  }

  async startFnChain() {
    try {
      await this.fn.apply(this, arguments)
      this.nextFnChain && this.nextFnChain.startFnChain.apply(this.nextFnChain, arguments)
    } catch (error) {
      console.log(error)
    }
  }
}
