import React, { useRef, useState, useContext } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import * as d3 from 'd3'

import Sphere from './shapes/Sphere'
import RotatingSphere from './shapes/RotatingSphere'

import { noise } from './lib/noise'


noise.seed(Math.random())
const noiseFunction = noise.perlin3

const spheres = d3.range(0,1000).map((d,i) => {
  const r = 2,
    radialPos = 2 * Math.PI * Math.random()

  return new RotatingSphere({
      noiseFunction,
      position: [
        (r + Math.random()) * Math.cos(radialPos),
        (r + Math.random()) * Math.sin(radialPos),
        -10 + noiseFunction(Math.random(), Math.random(), Math.random())
      ],
      id: i,
      r: r - 0.25 + Math.random() * 0.5,
      startRadians: radialPos,
      velocityScale: 0.003 + Math.random() * 0.004
    })

})

function Ring() {

  useFrame((state,delta) => spheres.forEach(sphere => {
    // sphere.setVelocity(delta)
    sphere.setPosition(delta)

    const { ref, position } = sphere

    ref.current.position.x = position[0]
    ref.current.position.y = position[1]
    ref.current.position.z = position[2]
    // console.log(position)
  }))

  return spheres.map(sphere => SphereMesh({ sphere }))
}

function SphereMesh({ sphere }) {

  // This reference will give us direct access to the mesh
  let mesh = useRef()

  // const { sphere } = props
  // Set up state for the hovered and active state
  let [hovered, setHover] = useState(false)
  let [active, setActive] = useState(false)

  sphere.ref = mesh

  let meshProps = {
    position: sphere.position
  }

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))


  return (
    <mesh
      {...meshProps}
      key={sphere.id}
      ref={mesh}
      >
      <sphereBufferGeometry attach="geometry" args={[0.05, 32, 32]} />
      <meshStandardMaterial attach="material" color={0xFFFFFF} />
    </mesh>
  )
}

function ClearColor() {
  const { gl } = useThree()
  gl.setClearColor(0x333333)
  return null
}

function App() {

  // const [spheres, setSpheres] = useState()

  function genSpheres() {
    return spheres.map((s,i) => SphereMesh(s, i))
  }

  return (

    <Canvas style={{ width: window.innerWidth, height: window.innerHeight}}>
      <ClearColor />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* { genSpheres() } */}
      <Ring></Ring>
    </Canvas>

  );
}

export default App;
