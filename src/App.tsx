import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import LicenseDetails from './components/LicenseDetails';

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/license/:id" element={<LicenseDetails />} />
      </Routes>
    </Router>
  );
}

export default App;