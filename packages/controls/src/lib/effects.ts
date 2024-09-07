export class Effects {
  constructor(
    private effects: (() => void)[] = [],
    private asyncEffects: (() => Promise<unknown>)[] = [],
  ) {}

  add(effect: () => void) {
    this.effects.push(effect)
  }

  addAsync(effect: () => Promise<unknown>) {
    this.asyncEffects.push(effect)
  }

  async run() {
    while (this.effects.length > 0) {
      this.effects.shift()?.()
    }

    while (this.asyncEffects.length > 0) {
      const asyncEffects = this.asyncEffects.slice()
      this.asyncEffects = []
      await Promise.all(asyncEffects.map((effect) => effect()))
    }
  }
}
