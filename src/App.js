import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import * as d3 from 'd3'

function SphereMesh(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh
      {...props}
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

  function setPosition(d) {
    const r = 3
    const prop = 2 * Math.PI * 1000 * Math.random()
    const x = (r + Math.random()) * Math.cos(prop),
      y = (r + Math.random()) * Math.sin(prop),
      z = 0

    return [x,y,-10]
  }

  function genSpheres() {
    return d3.range(0,1000).map(d => SphereMesh({ position: setPosition(d), key: d }))
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
