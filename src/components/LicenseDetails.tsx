import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, List, ListItem, ListItemText, Link } from '@mui/material';
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
      {license.logo && (
        <CardMedia
          component="img"
          height="140"
          image={license.logo}
          alt={`${license.name} logo`}
        />
      )}
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {license.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {license.description}
        </Typography>
        {license.attributes && (
          <>
            <Typography variant="h6" gutterBottom>Attributes:</Typography>
            <List>
              {Object.entries(license.attributes).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemText primary={`${key}: ${value ? 'Yes' : 'No'}`} />
                </ListItem>
              ))}
            </List>
          </>
        )}
        {license.popularProjects && license.popularProjects.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>Popular Projects:</Typography>
            <List>
              {license.popularProjects.map((project) => (
                <ListItem key={project.name}>
                  <ListItemText primary={project.name} />
                </ListItem>
              ))}
            </List>
          </>
        )}
        {license.details && (
          <>
            <Typography variant="h6" gutterBottom>Details:</Typography>
            <Typography variant="body2" paragraph>
              {license.details}
            </Typography>
          </>
        )}
        {license.officialUrl && (
          <Typography variant="body2" paragraph>
            Official Website: <Link href={license.officialUrl} target="_blank" rel="noopener noreferrer">
              {license.officialUrl}
            </Link>
          </Typography>
        )}
        <Typography variant="h6" gutterBottom>Full License Text:</Typography>
        <Typography variant="body2" component="pre" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {license.fullText}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LicenseDetails;