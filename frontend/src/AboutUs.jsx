import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import Neelay from "./images/neelay.png";
import Vishwa from "./images/vishwa.png";

// ----- Floating Glow Particles Behind Boxes -----
const GlowParticles = ({ count = 100, area = 10 }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = clock.getElapsedTime() * 0.01;
    }
  });
  return (
    <group ref={ref}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * area,
            (Math.random() - 0.5) * area,
            (Math.random() - 0.5) * area,
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};

// ----- Modal for Team Member Details -----
const MemberModal = ({ member, onClose }) => {
  if (!member) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-gray-900 p-6 rounded-2xl max-w-sm w-full text-white relative"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={member.photo}
            alt={member.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 object-cover border-4 border-cyan-400"
          />
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">
            {member.name}
          </h3>
          <p className="text-center text-gray-300 text-sm sm:text-base mb-2">
            {member.role}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed text-center sm:text-left">
            {member.bio}
          </p>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function AboutUs() {
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      name: "Vishwa Joshi",
      role: "Creative Director & Web Designer",
      photo: Vishwa,
      bio: "Studying B.Tech Biotechnology at PDEU, India. Leads frontend, creative design, content, and documentation for the exoplanet app.",
    },
    {
      name: "Neelay Jain",
      role: "ML Model & Backend Developer",
      photo: Neelay,
      bio: "Studying B.Tech Mechanical Engineering at PDEU, India. Handles ML model training, backend development, and website optimization.",
    },
  ];

  // detect mobile
  const isMobile = window.innerWidth < 768;

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden text-white"
      style={{
        fontFamily: "'Orbitron', sans-serif",
        backgroundColor: "black",
      }}
    >
      {/* Import font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* 3D Background */}
      <Canvas
        className="absolute inset-0 z-0"
        camera={{ position: isMobile ? [0, 3, 10] : [0, 5, 15], fov: 50 }}
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
        <GlowParticles count={80} area={12} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-purple-700/30 to-cyan-400/25 blur-3xl rounded-full z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-blue-700/30 to-purple-400/25 blur-3xl rounded-full z-0" />

      {/* Content */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-8 gap-10 sm:gap-12 max-w-7xl mx-auto py-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* About the Challenge */}
        <motion.div
          className="bg-black/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] w-full text-center sm:text-left"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-500 mb-3 sm:mb-4">
            ABOUT THE CHALLENGE
          </h2>
          <p className="text-gray-200 text-sm sm:text-lg leading-relaxed">
            The challenge focuses on developing an AI/ML model trained on NASA’s
            open exoplanet datasets to identify new exoplanets and create a
            user-friendly web interface. It automates the analysis of complex
            astronomical data—making discovery faster, more accurate, and
            accessible to researchers and enthusiasts.
          </p>
        </motion.div>

        {/* Team Members */}
        <motion.div className="flex flex-col sm:flex-row gap-8 sm:gap-12 w-full items-center justify-center">
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              className="flex flex-col items-center bg-black/50 backdrop-blur-md p-6 rounded-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] cursor-pointer hover:scale-105 transition-transform duration-300 w-full max-w-xs sm:max-w-none"
              onClick={() => setSelectedMember(member)}
            >
              <img
                src={member.photo}
                alt={member.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-cyan-400 mb-4 hover:shadow-[0_0_30px_#00ffff] transition-shadow duration-300"
              />
              <h3 className="text-lg sm:text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Intro Line */}
        <motion.p
          className="mt-6 text-center text-base sm:text-xl text-cyan-300 font-medium max-w-3xl mx-auto px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          We are Team SPECTRA — a duo of passionate innovators exploring the
          intersection of artificial intelligence and space science.
        </motion.p>
      </motion.div>

      {/* Member Modal */}
      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
}
