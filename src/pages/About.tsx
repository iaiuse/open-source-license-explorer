import React from 'react';
import { Container, Typography } from '@mui/material';

const About: React.FC = () => (
  <Container>
    <Typography variant="h4" component="h1" gutterBottom>
      About Open Source License Explorer
    </Typography>
    <Typography paragraph>
      This tool is designed to help developers, legal professionals, and anyone interested in open source software to understand and compare different open source licenses.
    </Typography>
    <Typography paragraph>
      We provide information on popular open source licenses, their key features, and examples of projects using these licenses. Our goal is to make it easier for you to choose the right license for your project or understand the implications of using software under various licenses.
    </Typography>
  </Container>
);

export default About;