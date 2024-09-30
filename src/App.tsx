import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/license/:id" component={LicenseDetails} />
      </Switch>
    </Router>
  );
}

export default App;