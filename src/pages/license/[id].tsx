import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { 
  Typography, 
  Box, 
  Button, 
  Chip,
  CircularProgress,
  Container,
  Paper
} from '@mui/material';
import { License } from '../../types';
import licensesData from '../../data/licenses.json';

const LicenseDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicense = () => {
      if (typeof id === 'string') {
        setLoading(true);
        // In a real app, this would be an API call
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
        <Typography variant="h4" gutterBottom>{license.name}</Typography>
        <ReactMarkdown>{license.spdx_description || license.summary}</ReactMarkdown>
        <Typography variant="h6" gutterBottom>分析：</Typography>
        <ReactMarkdown>{license.tldrlegal_analysis}</ReactMarkdown>
        <Typography variant="h6" gutterBottom>热门项目：</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
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
      </Paper>
    </Container>
  );
};

export default LicenseDetails;