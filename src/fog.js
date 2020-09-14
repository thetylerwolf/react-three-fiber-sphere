import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import * as d3 from 'd3'
import * as THREE from 'three'
import niceColors from 'nice-color-palettes'
import Sphere from './shapes/Sphere'
import FlowingSphere from './shapes/FlowingSphere'

import { noise } from './lib/noise'
import { FogExp2 } from 'three/build/three.module'

const numSpheres = 1000

// START NEW STUFF =========================

const _object = new THREE.Object3D()
const _color = new THREE.Color()

// From: https://codesandbox.io/s/r3f-instanced-colors-8fo01
function Capillaries({ num=5 }) {

  // const [ curves, setCurves ] = setCurves([])

  // if(!(curves.length === num)) {
  //   setCurves(
  //     [1,2,3,4].map(() => {
  //       const min = new THREE.Vector3(-5,-5,-3),
  //         max = new THREE.Vector3(5,5,3)

  //       return new THREE.CatmullRomCurve3([
  //         new THREE.Vector3(Math.random() * min.x, Math.random() * min.y, min.z + Math.abs( Math.random() * 2 * min.z )),
  //         ...[],
  //         new THREE.Vector3(Math.random() * max.x, Math.random() * max.y, max.z + Math.abs( Math.random() * 2 * max.z )),
  //       ])
  //     })
  //   )
  // }

  const colors = useMemo(() => new Array(numSpheres).fill().map(() => ['#000'][Math.floor(Math.random() * 3)]), [])
  // const colors = useMemo(() => new Array(numSpheres).fill().map(() => ['#fafafa', '#D4AF37'][Math.floor(Math.random() * 2)]), [])
  // const colors = useMemo(() => new Array(numSpheres).fill().map(() => '#4e0909'), [])

  const colorArray = useMemo(() => {
    const color = new Float32Array(numSpheres * 3)
    for (let i = 0; i < numSpheres; i++) {
      _color.set(colors[i])
      _color.toArray(color, i * 3)
    }
    return color
  }, [])

  const ref = useRef()
  const attrib = useRef()

  useFrame(state => {
    const time = state.clock.getElapsedTime()

    // curve.points.forEach(p => {
    //   p.x += -0.005 + Math.random() * 0.01
    //   p.y += -0.005 + Math.random() * 0.01
    //   p.z += -0.005 + Math.random() * 0.01
    // })
    // curve.needsUpdate = true

    spheres.forEach((sphere,id) => {

      sphere.setPosition(time)

      const { position } = sphere

      _object.position.set(position[0], position[1], position[2])
      _object.updateMatrix()
      ref.current.setMatrixAt(id, _object.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  const sphereRadius = 0.05

  return (
    <instancedMesh ref={ref} args={[null, null, numSpheres]}>
      <sphereBufferGeometry attach="geometry" args={[sphereRadius, 32, 32]}>
        <instancedBufferAttribute ref={attrib} attachObject={['attributes', 'color']} args={[colorArray, 3]} />
      </sphereBufferGeometry>
      <meshStandardMaterial attach="material" vertexColors={THREE.VertexColors} metalness={0.5} roughness={0.3} />
    </instancedMesh>
  )
}
// END NEW STUFF ===============================

noise.seed(Math.random())
const noiseFunction = noise.perlin2

const curves = [1].map(() => {
  const min = new THREE.Vector3(-8,-8,-10),
    max = new THREE.Vector3(8,8,-5)

  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(Math.random() * min.x, Math.random() * min.y, min.z + Math.abs( Math.random() * 2 * min.z )),
    ...[
      new THREE.Vector3(Math.random() * min.x, Math.random() * min.y, min.z + Math.abs( Math.random() * 2 * min.z )),
    ],
    new THREE.Vector3(Math.random() * max.x, Math.random() * max.y, max.z + Math.abs( Math.random() * 2 * max.z )),
  ])
})

const spheres = d3.range(0,numSpheres).map((d,i) => {
  return new FlowingSphere({
      noiseFunction,
      position: [
        0,0,0
      ],
      tubeRadius: 0.7,
      id: i,
      curve: curves[i % curves.length],
      startProgress: Math.random(),
      velocityScale: 0.001
    })

})

function ClearColor() {
  const { gl, camera } = useThree()
  // camera.position.z = 0.5
  // gl.setClearColor(0xCCDDFF)
  gl.setClearColor(0xd3c59c)
  return null
}

function App() {

  return (

    <Canvas
      style={{ width: window.innerWidth, height: window.innerHeight}}
    >
      <ClearColor />
      <pointLight position={[0, 0, 2]} intensity={1.4} />
      <pointLight position={[0, 0, -2]} intensity={1} />
      <fogExp2 attach="fog" args={['#d3c59c', 0.2]} />
      {/* <spotLight color={0xffffff} intensity={1} lookAt={new THREE.Vector3(1,1,1)}/> */}
      <Capillaries />
    </Canvas>

  );
}

export default App;
