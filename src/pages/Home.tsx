import React from 'react';
import { Container, Typography } from '@mui/material';
import LicenseSelector from '../components/LicenseSelector';
import LicenseComparison from '../components/LicenseComparison';

const Home: React.FC = () => (
  <Container>
    <Typography variant="h4" component="h1" gutterBottom>
      Open Source License Explorer
    </Typography>
    <LicenseSelector />
    <Typography variant="h5" component="h2" gutterBottom>
      License Comparison
    </Typography>
    <LicenseComparison />
  </Container>
);

export default Home;