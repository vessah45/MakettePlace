import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Container from './pages/Marketplace.jsx'
import Inscription from './pages/Inscription.jsx'
import Connexion from './pages/Connexion.jsx'
import CreerAnnonce from './pages/CreerAnnonce.jsx'
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboardvendeur from "./pages/Dashboardvendeur.jsx";

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Container />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/creerannonce" element={<CreerAnnonce />} />
        <Route path="*" element={<Home />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/Dashboard" element={<Dashboardvendeur />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
