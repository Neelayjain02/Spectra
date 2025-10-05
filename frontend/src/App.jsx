import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HeroSection from './HeroSection'
import FeatureInputPage from './FeatureInputPage'
import Navbar from './Navbar'
import Mission from "./Mission";
import About from "./AboutUs";
import ContactUs from "./ContactUs";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-[Orbitron]">
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/features" element={<FeatureInputPage />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/aboutus" element={<About />} />
          <Route path="/contactus" element={<ContactUs />} />
      </Routes>
    </div>
  )
}
