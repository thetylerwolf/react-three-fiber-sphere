import Sphere from './Sphere'

export default class RotatingSphere extends Sphere {

  constructor(props) {
    super(props)

    this.startRadians = props.startRadians || 0
    this.radians = this.startRadians
  }

  setPosition(time) {

    let delta = time - this.startTime

    let step = (this.velocityScale * 30/(2 * Math.PI))
    this.radians += step
    let cumDelta = time * this.velocityScale * 150
    let radius = this.r + this.noiseFunction(this.seed[0] + cumDelta, this.seed[1] + cumDelta)
    // this.position = [
    //   this.position[0] + Math.cos(step),
    //   this.position[1] + Math.sin(step),
    //   this.position[2]
    // ]
    this.position = [
      radius * Math.cos(this.radians),
      radius *  Math.sin(this.radians),
      this.position[2]
    ]

    // console.log(this.position)
  }

}
