import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Button, 
  TextField,
  Chip,
  Grid,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Search, Filter, GitCompare } from 'lucide-react';
import { License } from '../types';
import LicenseComparison from './LicenseComparison';

import licensesData from '../data/licenses.json';

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

const LicenseExplorer: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<License[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{[key: string]: number}>({});
  const [comparisonOpen, setComparisonOpen] = useState(false);

  useEffect(() => {
    setLicenses(licensesData);
  }, []);

  const handleLicenseToggle = (license: License) => {
    setSelectedLicenses(prev => 
      prev.includes(license) 
        ? prev.filter(l => l !== license)
        : [...prev, license].slice(-3)
    );
  };

  const handleOpenComparison = () => {
    setComparisonOpen(true);
  };

  const handleCloseComparison = () => {
    setComparisonOpen(false);
  };

  const filteredLicenses = licenses.filter(license => 
    license.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    Object.entries(filters).every(([key, value]) => 
      license.compatibility[key as keyof typeof license.compatibility] >= value
    )
  );

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
        开源许可证探索器
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField 
          fullWidth
          variant="outlined"
          placeholder="搜索许可证..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} />,
          }}
        />
        <Button variant="contained" startIcon={<Filter />}>
          筛选
        </Button>
        {selectedLicenses.length > 1 && (
          <Button variant="contained" startIcon={<GitCompare />} onClick={handleOpenComparison}>
            比较
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {filteredLicenses.map((license) => (
          <Grid item xs={12} sm={6} md={4} key={license.keyword}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                title={
                  <Link href={`/license/${license.keyword}`} passHref legacyBehavior>
                    <Typography variant="h6" color="primary" sx={{ cursor: 'pointer' }}>
                      {license.name}
                    </Typography>
                  </Link>
                }
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {license.spdx_description || license.summary}
                </Typography>
                <Box sx={{ mt: 2 }}>
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
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: compatibilityColors[key as keyof typeof compatibilityColors]
                            }
                          }} 
                        />
                      </Box>
                    </Tooltip>
                  ))}
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">热门项目：</Typography>
                  {license.popular_projects.slice(0, 3).map((project) => (
                    <Chip 
                      key={project.name}
                      label={project.name}
                      size="small"
                      sx={{ mr: 1, mt: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant={selectedLicenses.includes(license) ? "contained" : "outlined"}
                  onClick={() => handleLicenseToggle(license)}
                  fullWidth
                >
                  {selectedLicenses.includes(license) ? '取消选择' : '选择比较'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={comparisonOpen} onClose={handleCloseComparison} maxWidth="lg" fullWidth>
        <DialogTitle>许可证比较</DialogTitle>
        <DialogContent>
          <LicenseComparison selectedLicenses={selectedLicenses} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComparison}>关闭比较</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LicenseExplorer;