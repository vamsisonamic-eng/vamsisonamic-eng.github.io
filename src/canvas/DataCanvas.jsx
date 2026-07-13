import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../store/scrollState'

const COUNT = 6000

/* ------------------------------------------------------------------ */
/*  Morph targets — all generated procedurally, zero asset downloads   */
/* ------------------------------------------------------------------ */

// Scene 1 · The Core: a dense quantum sphere with an orbital shell
function buildCore() {
  const pos = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const shell = Math.random() < 0.82 ? 1.6 : 2.6 + Math.random() * 0.4
    const r = shell * Math.cbrt(Math.random() * 0.35 + 0.65)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  return pos
}

// Scene 2 · Data Pipelines: braided fiber-optic streams flowing on curves
function buildPipeline() {
  const pos = new Float32Array(COUNT * 3)
  const STREAMS = 7
  for (let i = 0; i < COUNT; i++) {
    const s = i % STREAMS
    const t = (i / COUNT) * 2 - 1 // -1 → 1 along the stream
    const x = t * 9
    const phase = s * 1.7
    const braidR = 0.55 + 0.25 * Math.sin(s * 2.1)
    const y = Math.sin(x * 0.55 + phase) * 1.6 + Math.cos(x * 1.3 + phase) * braidR
    const z = Math.cos(x * 0.45 + phase) * 1.4 + Math.sin(x * 1.1 - phase) * braidR
    pos[i * 3] = x + (Math.random() - 0.5) * 0.18
    pos[i * 3 + 1] = y * 0.6 + (Math.random() - 0.5) * 0.14
    pos[i * 3 + 2] = z * 0.6 + (Math.random() - 0.5) * 0.14 - 1
  }
  return pos
}

// Scene 3 · Tech Matrix: interconnected lattice of node clusters
function buildGrid() {
  const pos = new Float32Array(COUNT * 3)
  const NODES = 48
  const nodes = []
  for (let n = 0; n < NODES; n++) {
    nodes.push([
      ((n % 8) - 3.5) * 1.55,
      (Math.floor(n / 8) % 6 - 2.5) * 1.35,
      Math.sin(n * 12.9898) * 1.8 - 0.5,
    ])
  }
  for (let i = 0; i < COUNT; i++) {
    if (i % 4 === 0) {
      // connective tissue between two random nodes
      const a = nodes[i % NODES]
      const b = nodes[(i * 7 + 13) % NODES]
      const t = Math.random()
      pos[i * 3] = a[0] + (b[0] - a[0]) * t
      pos[i * 3 + 1] = a[1] + (b[1] - a[1]) * t
      pos[i * 3 + 2] = a[2] + (b[2] - a[2]) * t
    } else {
      // node cluster
      const n = nodes[i % NODES]
      const r = 0.28 * Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = n[0] + r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = n[1] + r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = n[2] + r * Math.cos(phi)
    }
  }
  return pos
}

/* ------------------------------------------------------------------ */
/*  Custom shader: GPU-side morphing, flow motion, neon color ramp     */
/* ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  attribute vec3 aPipe;
  attribute vec3 aGrid;
  attribute float aSeed;

  uniform float uTime;
  uniform float uMorphPipe;  // core → pipeline
  uniform float uMorphGrid;  // pipeline → grid
  uniform vec2 uMouse;
  uniform float uPixelRatio;

  varying float vSeed;
  varying float vDepth;

  void main() {
    vec3 p = mix(position, aPipe, uMorphPipe);
    p = mix(p, aGrid, uMorphGrid);

    // organic breathing / flow
    float t = uTime * 0.6 + aSeed * 6.2831;
    p += 0.06 * vec3(sin(t + p.y * 2.0), cos(t * 1.3 + p.x * 1.7), sin(t * 0.7 + p.z * 2.3));

    // pipeline current: particles race along x while in stream form
    p.x += uMorphPipe * (1.0 - uMorphGrid) * sin(uTime * 0.9 + aSeed * 40.0) * 0.25;

    // magnetic mouse pull on the core
    float coreness = 1.0 - uMorphPipe;
    p.xy += uMouse * coreness * 0.45 * (0.4 + aSeed * 0.6);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = (1.2 + aSeed * 2.4) * uPixelRatio;
    gl_PointSize = size * (14.0 / -mv.z);

    vSeed = aSeed;
    vDepth = smoothstep(-14.0, -2.0, mv.z);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uMorphPipe;
  uniform float uMorphGrid;

  varying float vSeed;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.05, d);

    vec3 cyan   = vec3(0.13, 0.89, 1.0);
    vec3 violet = vec3(0.49, 0.36, 1.0);
    vec3 pink   = vec3(1.0, 0.24, 0.51);
    vec3 mint   = vec3(0.24, 1.0, 0.69);

    vec3 base = mix(cyan, violet, vSeed);
    base = mix(base, pink, uMorphPipe * smoothstep(0.6, 1.0, vSeed));
    base = mix(base, mint, uMorphGrid * smoothstep(0.7, 1.0, vSeed));

    // hot center
    base += vec3(0.35) * smoothstep(0.18, 0.0, d);

    gl_FragColor = vec4(base, alpha * (0.35 + 0.65 * vDepth));
  }
`

function MorphField() {
  const mat = useRef()
  const group = useRef()

  const { core, pipe, grid, seeds } = useMemo(
    () => ({
      core: buildCore(),
      pipe: buildPipeline(),
      grid: buildGrid(),
      seeds: Float32Array.from({ length: COUNT }, () => Math.random()),
    }),
    []
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorphPipe: { value: 0 },
      uMorphGrid: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    []
  )

  useFrame((state, delta) => {
    const u = mat.current.uniforms
    u.uTime.value += delta

    // section blend windows across page scroll (4 sections)
    const p = scrollState.progress
    const targetPipe = THREE.MathUtils.smoothstep(p, 0.12, 0.34)
    const targetGrid = THREE.MathUtils.smoothstep(p, 0.45, 0.68)
    u.uMorphPipe.value = THREE.MathUtils.damp(u.uMorphPipe.value, targetPipe, 4, delta)
    u.uMorphGrid.value = THREE.MathUtils.damp(u.uMorphGrid.value, targetGrid, 4, delta)
    u.uMouse.value.x = THREE.MathUtils.damp(u.uMouse.value.x, scrollState.mouseX, 3, delta)
    u.uMouse.value.y = THREE.MathUtils.damp(u.uMouse.value.y, scrollState.mouseY, 3, delta)

    // slow cinematic drift + camera choreography by scroll
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      p * 1.2 + scrollState.mouseX * 0.12,
      2.5,
      delta
    )
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      scrollState.mouseY * -0.08,
      2.5,
      delta
    )
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      7 - targetPipe * 1.2 + targetGrid * 2.2,
      2.5,
      delta
    )
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetGrid * 0.6, 2.5, delta)
  })

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COUNT} array={core} itemSize={3} />
          <bufferAttribute attach="attributes-aPipe" count={COUNT} array={pipe} itemSize={3} />
          <bufferAttribute attach="attributes-aGrid" count={COUNT} array={grid} itemSize={3} />
          <bufferAttribute attach="attributes-aSeed" count={COUNT} array={seeds} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* wireframe halo accent around the core */}
      <mesh scale={2.9}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#7c5cff" wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  )
}

export default function DataCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      >
        <MorphField />
        <AdaptiveDpr pixelated />
        <Preload all />
      </Canvas>
      {/* vignette + depth gradient so UI text always stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#05060a_100%)]" />
    </div>
  )
}
