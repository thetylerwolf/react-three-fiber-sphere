import * as THREE from 'three'
import Sphere from './Sphere'

export default class RotatingSphere extends Sphere {

  constructor(props) {
    super(props)

    Object.assign(this, {
      startRadians: 0,
      tubeRadius: 1,
    }, props)

    this.radians = this.startRadians
  }

  setPosition(time) {

    let step = (this.velocityScale * 30/(2 * Math.PI))
    this.radians += step

    let cumDelta = time * this.velocityScale * 150
    // 1 - Sphere rotates around a circle
    // 2 - Sphere's radius increases and decreases
    // 3 - The rotation/radius system is transformed and rotated around the ring

    // let delta = time - this.startTime
    let currentRotation = new THREE.Quaternion(),
      ringRadius = this.r,
      zAngle = this.radians,
      rotationEuler = new THREE.Euler( 0, 0, zAngle, 'XYZ' )

    let tubePosition = new THREE.Vector3()
    tubePosition.x = ringRadius * Math.cos( zAngle )
    tubePosition.y = ringRadius * Math.sin( zAngle )

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

    this.position = spherePos.toArray()

  }

}
