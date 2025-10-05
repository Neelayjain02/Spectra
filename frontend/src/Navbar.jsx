import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-6 bg-black/20 backdrop-blur-md border-b border-cyan-500/30"
    >
      <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-600 drop-shadow-[0_0_10px_rgba(56,189,248,0.7)] tracking-widest">
      SPECTRA
      </h1>

      <div className="flex space-x-8 text-cyan-300 font-[Orbitron] text-sm">
        <motion.div whileHover={{ scale: 1.1, color: '#fff' }} transition={{ type: 'spring', stiffness: 200 }}>
          <Link to="/" className="hover:text-white cursor-pointer">
            Home
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1, color: '#fff' }} transition={{ type: 'spring', stiffness: 200 }}>
          <Link to="/features" className="hover:text-white cursor-pointer">
            Models
          </Link>
        </motion.div>

        <motion.a whileHover={{ scale: 1.1, color: '#fff' }} transition={{ type: 'spring', stiffness: 200 }} href="#mission" className="hover:text-white cursor-pointer">
          <Link to="/mission" className="hover:text-white cursor-pointer">
            Mission
          </Link>
        </motion.a>

        <motion.a whileHover={{ scale: 1.1, color: '#fff' }} transition={{ type: 'spring', stiffness: 200 }} href="#about" className="hover:text-white cursor-pointer">
          <Link to="/aboutus" className="hover:text-white cursor-pointer">
            About Us
          </Link>
        </motion.a>

        <motion.a whileHover={{ scale: 1.1, color: '#fff' }} transition={{ type: 'spring', stiffness: 200 }} href="#contact" className="hover:text-white cursor-pointer">
          <Link to="/contactus" className="hover:text-white cursor-pointer">
            Contact Us
          </Link>
        </motion.a>
      </div>
    </motion.nav>
  )
}

export default Navbar
