import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Globe2, Snowflake, Flame, Download } from "lucide-react";
import html2canvas from "html2canvas";

export default function PlanetPassport({ data }) {
  const passportRef = useRef();

  // Gradient mapping for planet types
  const planetGradients = {
    "Sub-Earth": "from-amber-500 via-orange-700 to-red-900 shadow-[0_0_50px_#fb923c]",
    "Super-Earth": "from-sky-400 via-teal-500 to-emerald-700 shadow-[0_0_50px_#34d399]",
    "Mini-Neptune": "from-cyan-300 via-blue-500 to-indigo-800 shadow-[0_0_50px_#60a5fa]",
    "Hot-Jupiter": "from-red-500 via-pink-600 to-purple-800 shadow-[0_0_55px_#f87171]",
    "Ice Giant": "from-indigo-400 via-blue-700 to-cyan-900 shadow-[0_0_50px_#38bdf8]",
  };

  const orbitStamps = {
    Habitable: { icon: <Globe2 className="w-10 h-10 text-green-400" />, label: "HABITABLE ZONE" },
    Cryogenic: { icon: <Snowflake className="w-10 h-10 text-blue-300" />, label: "CRYOGENIC ZONE" },
    "Non-habitable": { icon: <Flame className="w-10 h-10 text-red-400" />, label: "NON-HABITABLE" },
  };

  const {
    name = "Unknown",
    pred_label = "Unknown",
    proba = {},
    orbit = "Unknown",
    type = "Unknown",
    surfaceWater = "Unknown",
    travelTime = 0,
    radius = "Unknown",
    temperature = "Unknown",
  } = data || {};

  // Animate travel time
  const [displayTime, setDisplayTime] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(travelTime || 0);
    if (end > 0) {
      const timer = setInterval(() => {
        start += end / 50;
        if (start >= end) {
          setDisplayTime(end.toFixed(2));
          clearInterval(timer);
        } else {
          setDisplayTime(start.toFixed(2));
        }
      }, 40);
      return () => clearInterval(timer);
    }
  }, [travelTime]);

  // Download passport as image
  const downloadPassport = async () => {
    if (!passportRef.current) return;
    const canvas = await html2canvas(passportRef.current, { backgroundColor: null });
    const link = document.createElement("a");
    link.download = `${name}_passport.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white flex flex-col items-center justify-center p-4 font-[Orbitron] overflow-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold mb-6 tracking-[0.2em] text-center bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
      >
        PLANET PASSPORT
      </motion.h1>

      <motion.div
        ref={passportRef}
        className="w-full max-w-7xl p-6 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 flex flex-col md:flex-row gap-8 overflow-visible relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Left Details */}
        <div className="flex-1 space-y-2 text-sm md:text-base">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 tracking-widest">DETAILS</h2>
          <p><span className="font-bold">NAME:</span> {name}</p>
          <p><span className="font-bold">PREDICTION LABEL:</span> {pred_label}</p>
          <p><span className="font-bold">PLANET TYPE:</span> {type}</p>
          <p><span className="font-bold">ORBIT:</span> {orbit}</p>
          <p><span className="font-bold">RADIUS:</span> {radius} Earth Radii</p>
          <p><span className="font-bold">TEMPERATURE:</span> {temperature} K</p>
          <p><span className="font-bold">SURFACE WATER:</span> {surfaceWater}</p>
          <p><span className="font-bold">TRAVEL TIME:</span> {travelTime ? `${displayTime} ly` : "Unknown"}</p>

          {/* Model Confidence Bars */}
          {proba && Object.keys(proba).length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-1">MODEL CONFIDENCE</h3>
              {Object.entries(proba).map(([label, value]) => (
                <div key={label} className="mb-1">
                  <p className="text-xs md:text-sm">{label}</p>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-cyan-500"
                      style={{ width: `${(parseFloat(value) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Planet Visualization */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Orbit rings */}
          <div className="absolute w-64 h-64 rounded-full border border-cyan-400/30 animate-spin-slow" style={{ borderTopColor: "transparent" }} />
          <div className="absolute w-80 h-80 rounded-full border border-purple-500/30 animate-spin-reverse-slow" style={{ borderTopColor: "transparent" }} />
          {/* Planet */}
          <div
            className={`w-48 h-48 rounded-full bg-gradient-to-tr ${planetGradients[type] || "from-gray-600 to-gray-900"} animate-pulse-glow`}
          />
          {/* Orbit stamp overlay */}
          {orbitStamps[orbit] && (
            <div className="absolute bottom-2 right-2 opacity-30 rotate-[-15deg] flex flex-col items-center">
              {orbitStamps[orbit].icon}
              <p className="mt-1 text-xs font-bold tracking-widest uppercase">{orbitStamps[orbit].label}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Download Button */}
      <button
        onClick={downloadPassport}
        className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-full font-bold text-black flex items-center gap-2"
      >
        <Download className="w-5 h-5" />
        Download Passport
      </button>
    </div>
  );
}
