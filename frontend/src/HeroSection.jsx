import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
// Star component
const Star = () => {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        emissive="#fcd34d" // soft yellow
        color="#fef3c7"
        emissiveIntensity={1}
        transparent
        opacity={0.5} // soft transparency
      />
    </mesh>
  )
}

// Planet revolving around the star
const Planet = ({ distance = 5, speed = 0.5 }) => {
  const ref = useRef()
  const rotationRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    ref.current.position.x = Math.cos(t) * distance
    ref.current.position.z = Math.sin(t) * distance
    rotationRef.current.rotation.y += 0.01
  })
  return (
    <group ref={ref}>
      <mesh ref={rotationRef}>
        <sphereGeometry args={[1, 64, 64]} /> {/* Orange planet */}
        <meshStandardMaterial color="#f97316" roughness={0.5} metalness={0.7} />
      </mesh>
    </group>
  )
}

// Moving particle background
const MovingParticles = () => {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.02
    ref.current.rotation.x = clock.getElapsedTime() * 0.01
  })
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
  )
}

const HeroSection = () => {
   const navigate = useNavigate()
    return (
    <div className="relative w-full h-screen bg-black font-[Orbitron] overflow-hidden">
      <Canvas className="absolute inset-0 z-0" camera={{ position: [0, 5, 15], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={200} depth={100} count={5000} factor={4} saturation={1} fade speed={0.2} />
        <MovingParticles />

        {/* Entire system shifted to right-bottom */}
        <group position={[6, -3, -2]}>
          <Star />
          <Planet distance={3} speed={0.5} />
        </group>

        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Nebula Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black z-5 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-700/30 to-cyan-400/25 blur-3xl rounded-full z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-700/30 to-purple-400/25 blur-3xl rounded-full z-0" />

      {/* Hero Text */}
      <div className="absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-center h-full text-center px-6 pt-24 md:pt-0 md:space-x-16">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-500 drop-shadow-[0_0_25px_rgba(56,189,248,0.7)]"
          >
            SPECTRA
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-6 text-xl md:text-3xl text-cyan-200 font-semibold drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]"
          >
            <p>(Spectroscopic Planetary Exploration, Characterization & Transit Analysis)</p>
            AI-Driven Exoplanet Exploration
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="mt-6 max-w-2xl text-lg text-gray-300 leading-relaxed"
          >
            Discovering new worlds beyond our solar system using NASA’s Kepler datasets — powered by deep learning and cosmic vision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-10 flex flex-wrap justify-center md:justify-start gap-6"
          >
            <button
                onClick={() => navigate('/features')}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold shadow-[0_0_25px_rgba(165,243,252,0.5)] transition-all duration-300 transform hover:scale-110"
            >
                🚀 Launch Explorer
            </button>
            <button
                onClick={() => navigate('/mission')}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold shadow-[0_0_25px_rgba(165,243,252,0.5)] transition-all duration-300 transform hover:scale-110"
            >
                Mission Details
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
