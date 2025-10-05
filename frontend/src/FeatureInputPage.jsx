import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import PlanetPassport from "./PlanetPassport";

// ---------- Input Modal ----------
const InputModal = ({ isOpen, onClose, title, fields, values, setValues, onSubmit }) => {
  const handleChange = (e, name, type) => {
    if (type === "checkbox") setValues({ ...values, [name]: e.target.checked });
    else setValues({ ...values, [name]: e.target.value });
  };

  const filledCount = fields.filter(f => f.type === "checkbox" || values[f.name] !== "").length;
  const progress = Math.floor((filledCount / fields.length) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="relative bg-black rounded-2xl p-6 max-w-md w-full text-white flex flex-col gap-4 z-10 overflow-y-auto max-h-[80vh]"
          >
            <h2 className="text-2xl font-bold">{title}</h2>
            {fields.map(f => (
              <div key={f.name} className="flex flex-col">
                <label className="text-gray-300">{f.label}</label>
                <input
                  type={f.type || "text"}
                  checked={f.type === "checkbox" ? values[f.name] : undefined}
                  value={f.type !== "checkbox" ? values[f.name] : undefined}
                  onChange={(e) => handleChange(e, f.name, f.type)}
                  className={`p-2 rounded-md bg-gray-800 border border-gray-600 text-white ${f.type === "checkbox" ? "w-5 h-5" : ""}`}
                />
              </div>
            ))}
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
              <div className="h-2 bg-cyan-500" style={{ width: `${progress}%` }}></div>
            </div>
            <button
              disabled={progress < 100}
              onClick={() => onSubmit(values)}
              className={`mt-4 px-4 py-2 rounded-full font-bold text-black ${
                progress === 100 ? "bg-cyan-500 hover:bg-cyan-400" : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white font-bold">
              ✖
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------- Star ----------
const Star = ({ onClick }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.material.emissiveIntensity = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.4;
  });
  return (
    <mesh ref={ref} onClick={onClick}>
      <sphereGeometry args={[2, 128, 128]} />
      <meshStandardMaterial emissive="#fff59d" color="#fff176" roughness={0.3} metalness={0.8} />
    </mesh>
  );
};

// ---------- Planet ----------
const Planet = ({ distance = 8, speed = 0.2, onClick }) => {
  const ref = useRef();
  const rotationRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * distance;
    ref.current.position.z = Math.sin(t) * distance;
    if (rotationRef.current) rotationRef.current.rotation.y += 0.01;
  });
  return (
    <group ref={ref}>
      <mesh ref={rotationRef} onClick={onClick}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          color="#3a6ea5"
          roughness={0.5}
          metalness={0.2}
          emissive="#2a4f7c"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
};

// ---------- Orbit Ring ----------
const OrbitRing = ({ radius = 8 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
    <meshBasicMaterial color="#ffffff33" side={2} />
  </mesh>
);

// ---------- Clickable Orbit ----------
const ClickableOrbit = ({ radius = 8, onClick }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={onClick}>
    <ringGeometry args={[radius - 0.5, radius + 0.5, 128]} />
    <meshBasicMaterial color="white" opacity={0} transparent />
  </mesh>
);

// ---------- Moving Particles ----------
const MovingParticles = () => {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.01;
      ref.current.rotation.x = clock.getElapsedTime() * 0.005;
    }
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 400 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Nebula Glow ----------
const NebulaGlow = () => (
  <>
    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-700/30 to-cyan-400/25 blur-3xl rounded-full z-0 pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-700/30 to-purple-400/25 blur-3xl rounded-full z-0 pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black z-5 pointer-events-none" />
  </>
);

// ---------- Feature Input Page ----------
const FeatureInputPage = () => {
  const [modals, setModals] = useState({ star: false, planet: false, orbit: false });
  const [starValues, setStarValues] = useState({ koi_steff: "", koi_srad: "", koi_smass: "", koi_slogg: "", koi_smet: "" });
  const [planetValues, setPlanetValues] = useState({ koi_prad: "", koi_teq: "", koi_depth: "", koi_model_snr: "", koi_fpflag_nt: false, koi_fpflag_ss: false, koi_fpflag_co: false, koi_fpflag_ec: false, koi_score: "" });
  const [orbitValues, setOrbitValues] = useState({ koi_period: "", koi_duration: "", koi_num_transits: "", koi_impact: "", koi_insol: "", koi_eccentricity: "" });

  const [showPassport, setShowPassport] = useState(false);
  const [planetData, setPlanetData] = useState({});
  const [planetSpeed] = useState(0.2);
  const [loading, setLoading] = useState(false);

  const starFields = [
    { name: "koi_steff", label: "Stellar Temperature (K)", type: "number" },
    { name: "koi_srad", label: "Stellar Radius (Sun)", type: "number" },
    { name: "koi_smass", label: "Stellar Mass (Sun)", type: "number" },
    { name: "koi_slogg", label: "Surface Gravity (log g)", type: "number" },
    { name: "koi_smet", label: "Metallicity ([Fe/H])", type: "number" },
  ];

  const planetFields = [
    { name: "koi_prad", label: "Planet Radius (Earth)", type: "number" },
    { name: "koi_teq", label: "Equilibrium Temp (K)", type: "number" },
    { name: "koi_depth", label: "Transit Depth (ppm)", type: "number" },
    { name: "koi_model_snr", label: "Model SNR", type: "number" },
    { name: "koi_fpflag_nt", label: "Not Transit-like?", type: "checkbox" },
    { name: "koi_fpflag_ss", label: "Stellar Eclipse?", type: "checkbox" },
    { name: "koi_fpflag_co", label: "Centroid Offset?", type: "checkbox" },
    { name: "koi_fpflag_ec", label: "Ephemeris Match?", type: "checkbox" },
    { name: "koi_score", label: "Disposition Score", type: "number" },
  ];

  const orbitFields = [
    { name: "koi_period", label: "Orbital Period (days)", type: "number" },
    { name: "koi_duration", label: "Transit Duration (hrs)", type: "number" },
    { name: "koi_num_transits", label: "Number of Transits", type: "number" },
    { name: "koi_impact", label: "Impact Parameter", type: "number" },
    { name: "koi_insol", label: "Insolation (Earth=1)", type: "number" },
    { name: "koi_sma", label: "Semi-Major Axis (AU)", type: "number" },
  ];

  const countFilled = (fields, values) =>
    fields.filter(f => f.type === "checkbox" || values[f.name] !== "").length;

  const totalFeatures = starFields.length + planetFields.length + orbitFields.length;
  const filledFeatures =
    countFilled(starFields, starValues) +
    countFilled(planetFields, planetValues) +
    countFilled(orbitFields, orbitValues);
  const combinedProgress = Math.floor((filledFeatures / totalFeatures) * 100);

  // ----------- Backend Prediction -----------
  const handlePredict = async () => {
    setLoading(true);
    const inputData = { ...starValues, ...planetValues, ...orbitValues };

    try {
      const res = await fetch("https://spectra-hcbn.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
      });
      const data = await res.json();
      console.log("Prediction Response:", data);
      setPlanetData(data);
      setShowPassport(true);
    } catch (err) {
      console.error(err);
      alert("Prediction failed! Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black font-[Orbitron] overflow-hidden">
      {/* Canvas */}
      <Canvas className="absolute inset-0 z-0" camera={{ position: [0, 10, 25], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={200} depth={100} count={5000} factor={4} saturation={1} fade speed={0.2} />
        <MovingParticles />
        <group position={[0, 0, 0]}>
          <Star onClick={() => setModals({ ...modals, star: true })} />
          <OrbitRing radius={8} />
          <ClickableOrbit radius={8} onClick={() => setModals({ ...modals, orbit: true })} />
          <Planet distance={8} speed={planetSpeed} onClick={() => setModals({ ...modals, planet: true })} />
        </group>
        <OrbitControls enableZoom enablePan={false} enableRotate />
      </Canvas>

      <NebulaGlow />

      {/* Modals */}
      <InputModal isOpen={modals.star} onClose={() => setModals({ ...modals, star: false })} title="Star Properties" fields={starFields} values={starValues} setValues={setStarValues} onSubmit={() => setModals({ ...modals, star: false })} />
      <InputModal isOpen={modals.planet} onClose={() => setModals({ ...modals, planet: false })} title="Planet Properties" fields={planetFields} values={planetValues} setValues={setPlanetValues} onSubmit={() => setModals({ ...modals, planet: false })} />
      <InputModal isOpen={modals.orbit} onClose={() => setModals({ ...modals, orbit: false })} title="Orbit Properties" fields={orbitFields} values={orbitValues} setValues={setOrbitValues} onSubmit={() => setModals({ ...modals, orbit: false })} />

      {/* Combined Progress & Predict */}
      <div className="fixed bottom-0 left-0 w-full p-4 z-50 flex flex-col items-center pointer-events-none">
        <div className="w-11/12 h-3 bg-gray-700 rounded-full overflow-hidden pointer-events-none">
          <div className="h-3 bg-cyan-500" style={{ width: `${combinedProgress}%` }}></div>
        </div>
        <p className="text-xs text-gray-400 mt-1">{combinedProgress}% features completed</p>

        {combinedProgress === 100 && (
          <button
            className="mt-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-full font-bold text-black pointer-events-auto"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        )}
      </div>

      {/* Planet Passport */}
      <AnimatePresence>
        {showPassport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          >
            <PlanetPassport data={planetData} />
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold"
              onClick={() => setShowPassport(false)}
            >
              ✖
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureInputPage;

