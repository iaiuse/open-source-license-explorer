import React from 'react';
import { Container, Typography } from '@mui/material';
import LicenseExplorer from '../components/LicenseExplorer';

const Home: React.FC = () => (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
      开源许可证探索器
    </Typography>
    <LicenseExplorer />
  </Container>
);

export default Home;