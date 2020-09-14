import * as THREE from 'three'
import Sphere from './Sphere'
let a = false
export default class FlowingSphere extends Sphere {

  constructor(props) {
    super(props)

    Object.assign(this, {
      startPosition: [ 0, 0, 0 ],
      tubeRadius: 1,
      velocityScale: 0.1,
      startProgress: Math.random(),
      curve: new THREE.CatmullRomCurve3([ new THREE.Vector3() ])
    }, props)

    this.position = this.startPosition
    this.progress = this.startProgress

  }

  setPosition(time) {

    const curve = this.curve

    let step = this.velocityScale
    this.progress += step
    if(this.progress > 1) this.progress = 0

    let cumDelta = time * this.velocityScale * 150
    // 1 - Sphere rotates around a circle
    // 2 - Sphere's radius increases and decreases
    // 3 - The rotation/radius system is transformed and rotated around the ring

    // let delta = time - this.startTime
    let currentRotation = new THREE.Quaternion(),
      zAngle = curve.getTangentAt(this.progress),
      rotationEuler = new THREE.Euler( zAngle.x, zAngle.y, zAngle.z, 'XYZ' )

    let tubePosition = curve.getPointAt(this.progress)

    currentRotation.setFromEuler( rotationEuler )

    let tubeRadius = this.tubeRadius  * this.noiseFunction(this.seed[1] + cumDelta, this.seed[0] + cumDelta)
    let tubeAngle = Math.PI * this.noiseFunction(this.seed[0] + cumDelta, this.seed[1] + cumDelta)

    let spherePos = new THREE.Vector3(
      tubeRadius * Math.cos(tubeAngle),
      0,
      tubeRadius *  Math.sin(tubeAngle)
    )

    spherePos
      .applyQuaternion( currentRotation )
      .add( tubePosition )
// console.log(spherePos)
    this.position = spherePos.toArray()

  }

}
