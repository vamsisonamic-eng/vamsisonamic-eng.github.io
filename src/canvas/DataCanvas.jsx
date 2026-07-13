import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { scrollState } from '../store/scrollState'

const COUNT = 7000

/* ------------------------------------------------------------------ */
/*  Four procedural morph targets — zero asset downloads               */
/*  core → spend pipeline → neural helix → node lattice                */
/* ------------------------------------------------------------------ */

// Scene 1 · The Core: dense quantum sphere with a sparse outer shell
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

// Scene 2 · Spend Pipelines: braided fiber-optic streams
function buildPipeline() {
  const pos = new Float32Array(COUNT * 3)
  const STREAMS = 7
  for (let i = 0; i < COUNT; i++) {
    const s = i % STREAMS
    const t = (i / COUNT) * 2 - 1
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

// Scene 3 · Neural Helix: double helix with cross-links — the AI layer
function buildHelix() {
  const pos = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    const kind = i % 5
    const t = (i / COUNT) * 2 - 1 // -1 → 1 along axis
    const y = t * 4.6
    const angle = t * Math.PI * 4.2
    const R = 1.7
    if (kind < 2) {
      // strand A / strand B
      const a = angle + (kind === 1 ? Math.PI : 0)
      pos[i * 3] = Math.cos(a) * R + (Math.random() - 0.5) * 0.16
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 0.1
      pos[i * 3 + 2] = Math.sin(a) * R + (Math.random() - 0.5) * 0.16
    } else if (kind === 2) {
      // rungs between strands
      const f = Math.random()
      const a1 = angle
      pos[i * 3] = Math.cos(a1) * R * (1 - 2 * f)
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = Math.sin(a1) * R * (1 - 2 * f)
    } else {
      // ambient thought-cloud around the helix
      const r = 2.6 + Math.random() * 1.6
      const th = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(th) * r
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * 4.4
      pos[i * 3 + 2] = Math.sin(th) * r
    }
  }
  return pos
}

// Scene 4 · Node Lattice: interconnected clusters — the tech matrix
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
      const a = nodes[i % NODES]
      const b = nodes[(i * 7 + 13) % NODES]
      const t = Math.random()
      pos[i * 3] = a[0] + (b[0] - a[0]) * t
      pos[i * 3 + 1] = a[1] + (b[1] - a[1]) * t
      pos[i * 3 + 2] = a[2] + (b[2] - a[2]) * t
    } else {
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
/*  GPU morph shader — cyan signal, amber sparks, white-hot centers    */
/* ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  attribute vec3 aPipe;
  attribute vec3 aHelix;
  attribute vec3 aGrid;
  attribute float aSeed;

  uniform float uTime;
  uniform float uM1; // core → pipeline
  uniform float uM2; // pipeline → helix
  uniform float uM3; // helix → grid
  uniform vec2 uMouse;
  uniform float uPixelRatio;

  varying float vSeed;
  varying float vDepth;

  void main() {
    vec3 p = mix(position, aPipe, uM1);
    p = mix(p, aHelix, uM2);
    p = mix(p, aGrid, uM3);

    float t = uTime * 0.6 + aSeed * 6.2831;
    p += 0.06 * vec3(sin(t + p.y * 2.0), cos(t * 1.3 + p.x * 1.7), sin(t * 0.7 + p.z * 2.3));

    // pipeline current while in stream form
    p.x += uM1 * (1.0 - uM2) * sin(uTime * 0.9 + aSeed * 40.0) * 0.25;
    // helix slow spin while in helix form
    float spin = uM2 * (1.0 - uM3) * uTime * 0.25;
    float cs = cos(spin), sn = sin(spin);
    p.xz = mat2(cs, -sn, sn, cs) * p.xz;

    // magnetic mouse pull on the core
    float coreness = 1.0 - uM1;
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
  uniform float uM1;
  uniform float uM2;
  uniform float uM3;

  varying float vSeed;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.05, d);

    // restrained monochrome field — near-white particles with a disciplined
    // lime accent reserved for a minority of points, plus amber during the
    // pipeline/helix scenes only. No rainbow gradient.
    vec3 dim    = vec3(0.42, 0.42, 0.46);
    vec3 bright = vec3(0.92, 0.93, 0.95);
    vec3 lime   = vec3(0.831, 1.0, 0.373);  // #D4FF5F
    vec3 amber  = vec3(1.0, 0.706, 0.329);  // #FFB454

    vec3 base = mix(dim, bright, smoothstep(0.0, 1.0, vSeed));
    // a slim accent band gets the lime signal, always present but restrained
    base = mix(base, lime, smoothstep(0.86, 0.94, vSeed) * (1.0 - smoothstep(0.97, 1.0, vSeed)));

    // pipeline: amber sparks on the fastest particles
    base = mix(base, amber, uM1 * (1.0 - uM2) * smoothstep(0.9, 1.0, vSeed) * 0.85);
    // helix: amber rungs
    base = mix(base, amber, uM2 * (1.0 - uM3) * smoothstep(0.45, 0.55, vSeed) * (1.0 - smoothstep(0.6, 0.7, vSeed)) * 0.75);
    // lattice: lime node cores
    base = mix(base, lime, uM3 * smoothstep(0.8, 1.0, vSeed) * 0.8);

    // soft hot center
    base += vec3(0.22) * smoothstep(0.2, 0.0, d);

    gl_FragColor = vec4(base, alpha * (0.26 + 0.55 * vDepth));
  }
`

function MorphField() {
  const mat = useRef()
  const group = useRef()

  const { core, pipe, helix, grid, seeds } = useMemo(
    () => ({
      core: buildCore(),
      pipe: buildPipeline(),
      helix: buildHelix(),
      grid: buildGrid(),
      seeds: Float32Array.from({ length: COUNT }, () => Math.random()),
    }),
    []
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uM1: { value: 0 },
      uM2: { value: 0 },
      uM3: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    []
  )

  useFrame((state, delta) => {
    const u = mat.current.uniforms
    u.uTime.value += delta

    // scene blend windows across page scroll (5 sections)
    const p = scrollState.progress
    const t1 = THREE.MathUtils.smoothstep(p, 0.08, 0.24)
    const t2 = THREE.MathUtils.smoothstep(p, 0.34, 0.5)
    const t3 = THREE.MathUtils.smoothstep(p, 0.6, 0.78)
    u.uM1.value = THREE.MathUtils.damp(u.uM1.value, t1, 4, delta)
    u.uM2.value = THREE.MathUtils.damp(u.uM2.value, t2, 4, delta)
    u.uM3.value = THREE.MathUtils.damp(u.uM3.value, t3, 4, delta)
    u.uMouse.value.x = THREE.MathUtils.damp(u.uMouse.value.x, scrollState.mouseX, 3, delta)
    u.uMouse.value.y = THREE.MathUtils.damp(u.uMouse.value.y, scrollState.mouseY, 3, delta)

    // cinematic drift + camera choreography
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      p * 1.1 + scrollState.mouseX * 0.12,
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
      7 - t1 * 1.2 + t2 * 0.8 + t3 * 1.6,
      2.5,
      delta
    )
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, t3 * 0.6, 2.5, delta)
  })

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={COUNT} array={core} itemSize={3} />
          <bufferAttribute attach="attributes-aPipe" count={COUNT} array={pipe} itemSize={3} />
          <bufferAttribute attach="attributes-aHelix" count={COUNT} array={helix} itemSize={3} />
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

      {/* faint icosahedral halo around the core */}
      <mesh scale={2.9}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#6b6b74" wireframe transparent opacity={0.05} />
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
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.32} luminanceThreshold={0.4} luminanceSmoothing={0.25} mipmapBlur radius={0.4} />
          <Vignette eskil={false} offset={0.3} darkness={0.9} />
        </EffectComposer>
        <AdaptiveDpr pixelated />
        <Preload all />
      </Canvas>
      {/* extra vignette so the editorial layer always stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#0a0a0c_100%)]" />
    </div>
  )
}
