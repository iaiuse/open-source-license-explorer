import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Typography, 
  Box, 
  Button, 
  Chip,
  CircularProgress,
  Container,
  Paper,
  Grid,
  LinearProgress,
  Tooltip
} from '@mui/material';
import Image from 'next/image';
import { License } from '../../types';
import licensesData from '../../data/licenses.json';

const compatibilityLabels = {
  commercial: '商业使用',
  modification: '修改',
  distribution: '分发',
  private: '私有使用',
  patent: '专利保护',
  copyleft: 'Copyleft强度'
};

const compatibilityColors = {
  commercial: '#4caf50',
  modification: '#2196f3',
  distribution: '#ff9800',
  private: '#9c27b0',
  patent: '#f44336',
  copyleft: '#795548'
};

const LicenseDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicense = () => {
      if (typeof id === 'string') {
        setLoading(true);
        const foundLicense = (licensesData as License[]).find(l => l.keyword === id);
        setLicense(foundLicense || null);
        setLoading(false);
      }
    };

    fetchLicense();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!license) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>License not found</Typography>
        <Link href="/" passHref>
          <Button component="a" variant="contained" sx={{ mt: 2 }}>
            返回主页
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            {license.logo && (
              <Box sx={{ width: '100%', height: 150, position: 'relative' }}>
                <Image
                  src={license.logo}
                  alt={`${license.name} logo`}
                  layout="fill"
                  objectFit="contain"
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h4" gutterBottom>{license.name}</Typography>
            <Typography variant="body2" paragraph sx={{ mt: 1, mb: 2 }}>
              {license.spdx_description || license.summary}
            </Typography>
            <Box sx={{ mb: 2 }}>
              {Object.entries(license.compatibility).map(([key, value]) => (
                <Tooltip key={key} title={`${compatibilityLabels[key as keyof typeof compatibilityLabels]}: ${value}/5`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ minWidth: '100px' }}>
                      {compatibilityLabels[key as keyof typeof compatibilityLabels]}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={value * 20} 
                      sx={{ 
                        flexGrow: 1, 
                        ml: 1,
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: compatibilityColors[key as keyof typeof compatibilityColors]
                        }
                      }} 
                    />
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Grid>
        </Grid>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>分析：</Typography>
        <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-line', mb: 2 }}>
          {license.tldrlegal_analysis}
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>热门项目：</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {license.popular_projects.map((project) => (
            <Chip 
              key={project.name}
              label={`${project.name} (${project.stars} stars)`}
              component="a"
              href={project.url}
              target="_blank"
              clickable
              size="small"
            />
          ))}
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="outlined" 
            href={license.full_text_url} 
            target="_blank"
            sx={{ mr: 2 }}
          >
            查看完整许可证文本
          </Button>
          <Link href="/" passHref>
            <Button component="a" variant="contained">
              返回主页
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default LicenseDetails;