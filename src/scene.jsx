import React, { useMemo, useRef, useEffect, useState, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
const nightPalette = ["#a9f58a", "#83c7ff", "#c5a1ff"];
function NetworkGlobe({ mode, motion, theme }) {
  const palette =
    theme === "day" ? ["#367918", "#236caa", "#7340ad"] : nightPalette;
  const group = useRef();
  const particles = useRef();
  const { nodes, edges, stars } = useMemo(() => {
    let nodes = [];
    for (let i = 0; i < 88; i++) {
      const y = 1 - (i / 87) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * Math.PI * (3 - Math.sqrt(5));
      nodes.push(
        new THREE.Vector3(
          Math.cos(a) * r * 2.5,
          y * 2.5,
          Math.sin(a) * r * 2.5,
        ),
      );
    }
    const edges = [];
    nodes.forEach((a, i) =>
      nodes.slice(i + 1).forEach((b) => {
        if (a.distanceTo(b) < [0.93, 1.08, 1.23][mode])
          edges.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }),
    );
    const stars = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i++) {
      stars[i * 3] = Math.sin(i * 127.1) * 7;
      stars[i * 3 + 1] = Math.cos(i * 311.7) * 5;
      stars[i * 3 + 2] = Math.sin(i * 71.3) * 4 - 2;
    }
    return { nodes, edges: new Float32Array(edges), stars };
  }, [mode]);
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current) return;
    const t = motion ? clock.elapsedTime : 0;
    const scrollDepth = motion ? Math.min(window.scrollY / 800, 1) : 0;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      t * 0.055 + pointer.x * (motion ? 0.22 : 0),
      3,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -0.13 + pointer.y * (motion ? 0.12 : 0) + scrollDepth * 0.2,
      3,
      delta,
    );
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      scrollDepth * 0.4,
      3,
      delta,
    );
    if (particles.current && motion) {
      particles.current.rotation.z = t * 0.009;
      particles.current.position.y = -scrollDepth * 0.18;
    }
  });
  return (
    <>
      <ambientLight intensity={1} />
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[2.43, 44, 28]} />
          <meshBasicMaterial color="#16241d" transparent opacity={0.17} />
        </mesh>
        <mesh rotation={[0.1, 0, 0.25]}>
          <sphereGeometry args={[2.48, 32, 20]} />
          <meshBasicMaterial
            wireframe
            color={palette[mode]}
            transparent
            opacity={0.075}
          />
        </mesh>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[edges, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={palette[mode]} transparent opacity={0.33} />
        </lineSegments>
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[i % 9 === 0 ? 0.052 : 0.022, 8, 8]} />
            <meshBasicMaterial
              color={
                i % 9 === 0
                  ? theme === "day"
                    ? "#22482a"
                    : "#eaffde"
                  : palette[mode]
              }
            />
          </mesh>
        ))}
        {[0, 1, 2].map((n) => (
          <group key={n} rotation={[n * 0.8 + 0.2, n * 0.65, 0.55]}>
            <mesh>
              <torusGeometry args={[2.85 + n * 0.14, 0.009, 6, 160]} />
              <meshBasicMaterial
                color={palette[mode]}
                transparent
                opacity={n === 0 ? 0.48 : 0.2}
              />
            </mesh>
            <mesh position={[2.85 + n * 0.14, 0, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial
                color={theme === "day" ? "#22482a" : "#edffe4"}
              />
            </mesh>
          </group>
        ))}
        <mesh>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshBasicMaterial
            color={palette[mode]}
            wireframe
            transparent
            opacity={0.22}
          />
        </mesh>
      </group>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.019}
          color={palette[mode]}
          transparent
          opacity={0.45}
          sizeAttenuation
        />
      </points>
    </>
  );
}
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function HeroScene({ mode, motion, theme }) {
  const ref = useRef();
  const [visible, setVisible] = useState(true);
  const [available] = useState(() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    o.observe(ref.current);
    const hide = () =>
      setVisible(
        !document.hidden && ref.current.getBoundingClientRect().bottom > 0,
      );
    document.addEventListener("visibilitychange", hide);
    return () => {
      o.disconnect();
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  const poster = (
    <img
      className="scene-poster"
      src={`${import.meta.env.BASE_URL}hero-poster.png`}
      alt=""
    />
  );
  return (
    <div ref={ref} className="scene" aria-hidden="true">
      {available ? (
        <Boundary fallback={poster}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 8.3], fov: 48 }}
            frameloop={visible && motion ? "always" : "demand"}
            gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          >
            <NetworkGlobe mode={mode} motion={motion} theme={theme} />
          </Canvas>
        </Boundary>
      ) : (
        poster
      )}
    </div>
  );
}
