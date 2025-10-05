import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// -----------------------------
// Navbar Component
// -----------------------------
const Navbar = () => {
  return (
    <nav className="absolute top-0 right-0 flex space-x-8 p-8 text-white text-lg font-semibold z-20">
      <Link to="/" className="hover:text-cyan-300 transition">HUNT</Link>
      <Link to="/about" className="hover:text-cyan-300 transition">ABOUT US</Link>
      <Link to="/methodology" className="hover:text-cyan-300 transition">METHODOLOGY</Link>
    </nav>
  );
};

// -----------------------------
// 3D Elements for Background
// -----------------------------
const Star = () => (
  <mesh>
    <sphereGeometry args={[2, 64, 64]} />
    <meshStandardMaterial
      emissive="#fcd34d"
      color="#fef3c7"
      emissiveIntensity={1}
      transparent
      opacity={0.5}
    />
  </mesh>
);

const Planet = ({ distance = 5, speed = 0.5 }) => {
  const ref = useRef();
  const rotationRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * distance;
    ref.current.position.z = Math.sin(t) * distance;
    rotationRef.current.rotation.y += 0.01;
  });
  return (
    <group ref={ref}>
      <mesh ref={rotationRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#f97316" roughness={0.5} metalness={0.7} />
      </mesh>
    </group>
  );
};

const MovingParticles = () => {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = clock.getElapsedTime() * 0.01;
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 200 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="white" emissive="white" />
        </mesh>
      ))}
    </group>
  );
};

// -----------------------------
// Main Mission Page
// -----------------------------
export default function Mission() {
  return (
    <div className="relative w-full h-screen bg-black font-[Orbitron] overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Background Scene */}
      <Canvas
        className="absolute inset-0 z-0"
        camera={{ position: [0, 5, 15], fov: 50 }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Stars
          radius={200}
          depth={100}
          count={5000}
          factor={4}
          saturation={1}
          fade
          speed={0.2}
        />
        <MovingParticles />
        <group position={[6, -3, -2]}>
          <Star />
          <Planet distance={3} speed={0.5} />
        </group>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-700/30 to-cyan-400/25 blur-3xl rounded-full z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-700/30 to-purple-400/25 blur-3xl rounded-full z-0" />

      {/* Mission Text */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center px-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl bg-black/30 backdrop-blur-md p-10 rounded-2xl border border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.3)]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-500 mb-6">
            Mission
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed">
            <strong>SPECTRA</strong> (Spectroscopic Planetary Exploration,
            Characterization & Transit Analysis) is an AI-driven web platform
            that predicts whether a celestial object observed in NASA’s Kepler
            dataset is a confirmed exoplanet, a planetary candidate, or a false
            positive.
            <br />
            <br />
            Our system works by feeding Kepler’s dataset into a machine learning
            model trained to recognize the periodic dips in starlight caused by
            transiting planets. The backend processes user-entered parameters—
            divided into three sections: star data, exoplanet data and orbital
            data—while the frontend transforms this process into an interactive
            star-and-orbit interface.
            <br />
            <br />
            When the user submits data, the model classifies the object and
            generates a visually rich “Planet Passport” summarizing its
            characteristics.
            <br />
            <br />
            The project reduces the time and expertise needed for manual data
            analysis, making exoplanet discovery more accessible to both
            scientists and enthusiasts.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
