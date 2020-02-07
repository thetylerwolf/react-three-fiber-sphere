import Sphere from './Sphere'

export default class RotatingSphere extends Sphere {
  constructor(props) {
    super(props)

    this.startRadians = props.startRadians || 0
    this.radians = this.startRadians
  }

  setPosition(delta) {
    // super.setPosition()
// return
    let step = (this.velocityScale * 30/(2 * Math.PI))
    this.radians += step
    this.cumDelta = (this.cumDelta || 0) + delta * this.velocityScale * 100
    let radius = this.r + this.noiseFunction(this.seed[0] + this.cumDelta, this.seed[1] + this.cumDelta, this.seed[2] + this.cumDelta)
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
