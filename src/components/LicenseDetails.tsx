import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';
import licenses from '../data/licenses.json';
import { License } from '../types';

const LicenseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const license = (licenses as License[]).find((l) => l.keyword === id);

  if (!license) {
    return <Typography>License not found</Typography>;
  }

  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={license.logo}
        alt={`${license.name} logo`}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {license.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {license.description}
        </Typography>
        <Typography variant="h6">Popular Projects:</Typography>
        <ul>
          {license.popularProjects.map((project) => (
            <li key={project.name}>{project.name}</li>
          ))}
        </ul>
        <Typography variant="h6">License Text:</Typography>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {license.details}
        </pre>
      </CardContent>
    </Card>
  );
};

export default LicenseDetails;