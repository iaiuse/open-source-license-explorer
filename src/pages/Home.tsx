import React from 'react';
import { Container, Typography } from '@mui/material';
import LicenseExplorer from '../components/LicenseExplorer';

const Home: React.FC = () => (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <LicenseExplorer />
  </Container>
);

export default Home;