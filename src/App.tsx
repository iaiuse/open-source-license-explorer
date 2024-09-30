import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from './components/Header';
import About from './pages/About';
import LicenseDetails from './components/LicenseDetails';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/license/:id" element={<LicenseDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;