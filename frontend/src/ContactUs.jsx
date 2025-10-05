import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

// ----- Floating Glow Particles -----
const GlowParticles = ({ count = 100, area = 10 }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = clock.getElapsedTime() * 0.01;
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

// ----- Thank You Modal -----
const ThankYouModal = ({ visible, onClose }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 p-6 rounded-2xl text-white max-w-sm w-full text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-gray-300">Your message has been sent successfully.</p>
            <button
              className="mt-4 px-4 py-2 bg-cyan-500 rounded hover:bg-cyan-400 transition"
              onClick={onClose}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can integrate API POST request here
    console.log(formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden text-white"
      style={{ fontFamily: "'Orbitron', sans-serif", backgroundColor: "black" }}
    >
      {/* 3D Background */}
      <Canvas className="absolute inset-0 z-0" camera={{ position: [0, 5, 15], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={200} depth={100} count={5000} factor={4} saturation={1} fade speed={0.2} />
        <GlowParticles count={80} area={12} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-700/30 to-cyan-400/25 blur-3xl rounded-full z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-700/30 to-purple-400/25 blur-3xl rounded-full z-0" />

      {/* Contact Form */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] max-w-lg w-full flex flex-col gap-4"
        >
          <h2 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-500 text-center">
            CONTACT US
          </h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="p-3 rounded bg-black/40 border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="p-3 rounded bg-black/40 border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            className="p-3 rounded bg-black/40 border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <button
            type="submit"
            className="mt-2 px-4 py-3 bg-cyan-500 rounded hover:bg-cyan-400 transition font-bold"
          >
            Send Message
          </button>
        </motion.form>
      </motion.div>

      {/* Thank You Modal */}
      <ThankYouModal visible={submitted} onClose={() => setSubmitted(false)} />
    </div>
  );
}
