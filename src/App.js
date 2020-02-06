import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import * as d3 from 'd3'

import Sphere from './shapes/Sphere'

import { noise } from './lib/noise'

noise.seed(Math.random())
const noiseFunction = noise.perlin3

function SphereMesh(sphere, key) {
  // This reference will give us direct access to the mesh
  let mesh = useRef()

  // Set up state for the hovered and active state
  let [hovered, setHover] = useState(false)
  let [active, setActive] = useState(false)

  let props = {
    position: sphere.position
  }

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh
      {...props}
      key={key}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={e => setActive(!active)}
      onPointerOver={e => setHover(true)}
      onPointerOut={e => setHover(false)}>
      <sphereBufferGeometry attach="geometry" args={[0.05, 32, 32]} />
      <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function ClearColor() {
  const { gl } = useThree()
  gl.setClearColor(0x333333)
  return null
}

function App() {

  const [spheres, setSpheres] = useState(d3.range(0,1000).map((d,i) => {
    const r = 3,
      radialPos = 2 * Math.PI * Math.random()

    return new Sphere({ noiseFunction,
      position: [
        (r + Math.random()) * Math.cos(radialPos),
        (r + Math.random()) * Math.sin(radialPos),
        -10 + noiseFunction(Math.random(), Math.random(), Math.random())
      ],
      r
    })
  }))
console.log(spheres)
  function setPosition(d) {
    const r = 3
    const prop = 2 * Math.PI * 1000 * Math.random()
    const x = (r + Math.random()) * Math.cos(prop),
      y = (r + Math.random()) * Math.sin(prop),
      z = 0

    return [x,y,-10]
  }

  function genSpheres() {
    return spheres.map((s,i) => SphereMesh(s, i))
  }

  return (
    <Canvas style={{ width: window.innerWidth, height: window.innerHeight}}>
      <ClearColor />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      { genSpheres() }
    </Canvas>
  );
}

export default App;
