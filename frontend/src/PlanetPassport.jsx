import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Snowflake, Flame } from "lucide-react";

export default function PlanetPassport({ data }) {
  // Gradient mapping for planet types
  const planetGradients = {
    "Sub-Earth":
      "from-amber-500 via-orange-700 to-red-900 shadow-[0_0_40px_#fb923c]",
    "Super-Earth":
      "from-sky-400 via-teal-500 to-emerald-700 shadow-[0_0_40px_#34d399]",
    "Mini-Neptune":
      "from-cyan-300 via-blue-500 to-indigo-800 shadow-[0_0_40px_#60a5fa]",
    "Hot-Jupiter":
      "from-red-500 via-pink-600 to-purple-800 shadow-[0_0_45px_#f87171]",
    "Ice Giant":
      "from-indigo-400 via-blue-700 to-cyan-900 shadow-[0_0_40px_#38bdf8]",
  };

  // Orbit label and icon mapping
  const orbitStamps = {
    Habitable: {
      icon: <Globe2 className="w-12 h-12 text-green-400" />,
      label: "HABITABLE ZONE",
    },
    Cryogenic: {
      icon: <Snowflake className="w-12 h-12 text-blue-300" />,
      label: "CRYOGENIC ZONE",
    },
    "Non-habitable": {
      icon: <Flame className="w-12 h-12 text-red-400" />,
      label: "NON-HABITABLE",
    },
  };

  // Handle missing data gracefully
  const {
    name = "Unknown",
    orbit = "Unknown",
    type = "Unknown",
    surfaceWater = "Unknown",
    travelTime = 0,
  } = data || {};

  // Animated counter for travel time
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white flex flex-col items-center justify-center p-8 font-[Orbitron]">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold mb-8 tracking-[0.3em] text-center bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
      >
        PLANET PASSPORT
      </motion.h1>

      <motion.div
        className="grid grid-cols-3 gap-8 w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        {/* Left Details Panel */}
        <motion.div
          className="col-span-2 bg-white/10 rounded-3xl p-8 backdrop-blur-xl border border-white/20 relative overflow-hidden hover:shadow-[0_0_40px_#38bdf8] transition-all duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl font-semibold mb-6 tracking-widest">
            DETAILS
          </h2>
          <div className="space-y-3 text-lg">
            <p><span className="font-bold">NAME:</span> {name}</p>
            <p><span className="font-bold">ORBIT:</span> {orbit}</p>
            <p><span className="font-bold">TYPE:</span> {type}</p>
            <p><span className="font-bold">SURFACE WATER:</span> {surfaceWater}</p>
            <p>
              <span className="font-bold">TRAVEL TIME:</span>{" "}
              {travelTime ? `${displayTime} ly` : "Unknown"}
            </p>
          </div>

          {/* Orbit stamp overlay */}
          {orbitStamps[orbit] && (
            <motion.div
              initial={{ opacity: 0, rotate: -20 }}
              animate={{ opacity: 0.3, rotate: -10 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-6 right-6 rotate-[-15deg]"
            >
              <div className="flex flex-col items-center">
                {orbitStamps[orbit].icon}
                <p className="mt-1 text-xs font-bold tracking-widest uppercase">
                  {orbitStamps[orbit].label}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right Planet Visualization */}
        <motion.div
          className="flex items-center justify-center relative"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {/* Rotating orbit ring */}
          <motion.div
            className="absolute w-64 h-64 rounded-full border border-cyan-400/40 animate-spin-slow"
            style={{ borderTopColor: "transparent" }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full border border-purple-500/30 animate-spin-reverse-slow"
            style={{ borderTopColor: "transparent" }}
          />

          {/* Planet sphere */}
          <motion.div
            className={`w-48 h-48 rounded-full bg-gradient-to-tr ${
              planetGradients[type] || "from-gray-600 to-gray-900"
            } animate-pulse-glow`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 80 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Extra animations (add to your global CSS or Tailwind config)
// e.g., in globals.css or index.css:
/*
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes spin-reverse-slow {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}
.animate-spin-reverse-slow {
  animation: spin-reverse-slow 20s linear infinite;
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.5); }
  50% { box-shadow: 0 0 60px rgba(0, 255, 255, 0.9); }
}
.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}
*/
