// PROPS
// noiseFunction: () => number
// hSegs: number
// vSegs: number
// r (radius): number
// velocityScale: number (0-1)
// position: { x: number, y: number, z: number }
//

export default class Sphere {

  constructor(props = {}) {
    Object.assign(this, {
      noiseFunction: () => 1,
      hSegs: 32,
      vSegs: 32,
      r: 1,
      velocityScale: 1,
      position: [ 0, 0, 0 ] // [x,y,z]
    }, props)

    this.startTime = Date.now()

    this.seed = [
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100
    ]

    this.velocity = [ 0, 0, 0 ]
  }

  setVelocity(time) {

    let delta = time - this.startTime

    this.velocity = this.velocity.map((v,i) => v + this.noiseFunction(this.seed[i] + delta * this.velocityScale))

  }

  setPosition() {
    this.position = this.position.map((p,i) => p + this.velocity[i])
  }

}
