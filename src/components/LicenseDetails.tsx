import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Button, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { License } from '../types';
import licensesData from '../data/licenses.json';

const LicenseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicense = () => {
      setLoading(true);
      // In a real app, this would be an API call
      const foundLicense = (licensesData as License[]).find(l => l.keyword === id);
      setLicense(foundLicense || null);
      setLoading(false);
    };

    fetchLicense();
  }, [id]);

  const handleClose = () => {
    navigate('/');
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!license) {
    return <Typography>License not found</Typography>;
  }

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{license.name}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          {license.spdx_description || license.summary}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>分析：</Typography>
        <Typography variant="body2" paragraph>
          {license.tldrlegal_analysis}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>热门项目：</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {license.popular_projects.map((project) => (
            <Chip 
              key={project.name}
              label={`${project.name} (${project.stars} stars)`}
              component="a"
              href={project.url}
              target="_blank"
              clickable
            />
          ))}
        </Box>
        <Button 
          sx={{ mt: 2 }}
          variant="outlined" 
          href={license.full_text_url} 
          target="_blank"
        >
          查看完整许可证文本
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LicenseDetails;