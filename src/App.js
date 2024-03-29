import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import * as d3 from "d3";
import * as THREE from "three";
import niceColors from "nice-color-palettes";
import Sphere from "./shapes/Sphere";
import RotatingSphere from "./shapes/RotatingSphere";

import { noise } from "./lib/noise";

const numSpheres = 1100;

// START NEW STUFF =========================

const _object = new THREE.Object3D();
const _color = new THREE.Color();

// From: https://codesandbox.io/s/r3f-instanced-colors-8fo01
function Spheres() {
  // const { gl } = useThree()
  // const colors = useMemo(() => new Array(numSpheres).fill().map(() => niceColors[15][Math.floor(Math.random() * 5)]), [])
  const colors = useMemo(
    () =>
      new Array(numSpheres)
        .fill()
        .map(
          () => ["#4e0909", "#fafafa", "#1578b2"][Math.floor(Math.random() * 3)]
        ),
    []
  );
  // const colors = useMemo(() => new Array(numSpheres).fill().map(() => ['#fafafa', '#D4AF37'][Math.floor(Math.random() * 2)]), [])
  // const colors = useMemo(() => new Array(numSpheres).fill().map(() => '#4e0909'), [])

  const colorArray = useMemo(() => {
    const color = new Float32Array(numSpheres * 3);
    for (let i = 0; i < numSpheres; i++) {
      _color.set(colors[i]);
      _color.toArray(color, i * 3);
    }
    return color;
  }, []);

  const ref = useRef();
  const attrib = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    spheres.forEach((sphere, id) => {
      sphere.setPosition(time);

      const { position } = sphere;

      _object.position.set(position[0], position[1], position[2]);
      _object.updateMatrix();
      ref.current.setMatrixAt(id, _object.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, numSpheres]}>
      <sphereBufferGeometry attach="geometry" args={[0.05, 32, 32]}>
        <instancedBufferAttribute
          ref={attrib}
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </sphereBufferGeometry>
      <meshStandardMaterial
        attach="material"
        vertexColors={THREE.VertexColors}
        metalness={0.5}
        roughness={0.3}
      />
    </instancedMesh>
  );
}
// END NEW STUFF ===============================

noise.seed(Math.random());
const noiseFunction = noise.perlin2;

const spheres = d3.range(0, numSpheres).map((d, i) => {
  const r = 2,
    radialPos = 2 * Math.PI * Math.random();

  return new RotatingSphere({
    noiseFunction,
    position: [
      (r + Math.random()) * Math.cos(radialPos),
      (r + Math.random()) * Math.sin(radialPos),
      -10 + noiseFunction(Math.random(), Math.random()),
    ],
    id: i,
    r: r - 0.25 + Math.random() * 0.5,
    startRadians: radialPos,
    velocityScale: 0.001 + Math.random() * 0.003,
  });
});

function ClearColor() {
  const { gl, camera } = useThree();
  // camera.position.z = 0.5
  // gl.setClearColor(0xCCDDFF)
  gl.setClearColor(0x1a1a1a);
  return null;
}

function App() {
  return (
    <Canvas style={{ width: window.innerWidth, height: window.innerHeight }}>
      <ClearColor />
      <pointLight position={[0, 0, 2]} intensity={1.4} />
      <pointLight position={[0, 0, -2]} intensity={1} />
      {/* <spotLight color={0xffffff} intensity={1} lookAt={new THREE.Vector3(1,1,1)}/> */}
      <Spheres />
    </Canvas>
  );
}

export default App;
