import React from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";

// ----- Floating Panel Component -----
const FloatingPanel = ({ children, delay = 0 }) => {
  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-cyan-400/50 shadow-[0_0_30px_rgba(0,255,255,0.2)] max-w-3xl mx-auto mb-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 50px #0ff" }}
    >
      {children}
    </motion.div>
  );
};

export default function Mission() {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden text-white"
      style={{ fontFamily: "'Orbitron', sans-serif", backgroundColor: "black" }}
    >
      {/* Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* 3D Background */}
      <Canvas camera={{ position: [0, 5, 20], fov: 55 }} className="absolute inset-0 z-0">
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={200} depth={100} count={6000} factor={4} saturation={1} fade speed={0.3} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />

      {/* Floating Panels */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-16 gap-8">
        <FloatingPanel delay={0}>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-500 mb-4">
            Mission
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed font-light">
            <strong>SPECTRA</strong> (Spectroscopic Planetary Exploration, Characterization & Transit Analysis) is an AI-driven web platform that predicts whether a celestial object in NASA’s Kepler dataset is a confirmed exoplanet, a planetary candidate, or a false positive.
          </p>
        </FloatingPanel>

        <FloatingPanel delay={0.5}>
          <p className="text-gray-200 text-lg leading-relaxed font-light">
            Our system analyzes dips in starlight caused by transiting planets using a trained ML model. Users can input star, exoplanet, and orbital data, and receive predictions in an intuitive interface.
          </p>
        </FloatingPanel>

        <FloatingPanel delay={1}>
          <p className="text-gray-200 text-lg leading-relaxed font-light">
            By merging astronomy and AI, <strong>SPECTRA</strong> accelerates exoplanet discovery — making it accessible for scientists, students, and enthusiasts alike.
          </p>
        </FloatingPanel>
      </div>
    </div>
  );
}
