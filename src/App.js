import React, { useRef, useState, useContext } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import * as d3 from 'd3'

import Sphere from './shapes/Sphere'

import { noise } from './lib/noise'


noise.seed(Math.random())
const noiseFunction = noise.perlin3

const spheres = d3.range(0,100).map((d,i) => {
  const r = 3,
    radialPos = 2 * Math.PI * Math.random()

  return new Sphere({
      noiseFunction,
      position: [
        (r + Math.random()) * Math.cos(radialPos),
        (r + Math.random()) * Math.sin(radialPos),
        -10 + noiseFunction(Math.random(), Math.random(), Math.random())
      ],
      id: i,
      r,
      velocityScale: 0.000001
    })

})

function Ring() {

  useFrame((state,delta) => spheres.forEach(sphere => {
    sphere.setVelocity(delta)
    const { ref, position } = sphere
    ref.current.position.x = position.x
    ref.current.position.y = position.y
    ref.current.position.z = position.z
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
      <meshStandardMaterial attach="material" color={'orange'} />
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
