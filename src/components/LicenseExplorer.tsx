import React, { useState, useEffect } from 'react';
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
  DialogActions,
  Avatar
} from '@mui/material';
import { Search, Filter, GitCompare, Info } from 'lucide-react';
import LicenseComparison from './LicenseComparison';
import LicenseDetailDialog from './LicenseDetailDialog';
import { License } from '../types';
import licensesData from '../data/licenses.json';

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
  const [filters, setFilters] = useState<Partial<Record<CompatibilityKey, number>>>({});
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  
  type CompatibilityKey = 'commercial' | 'modification' | 'distribution' | 'private' | 'patent' | 'copyleft';
  
  const compatibilityLabels: Record<CompatibilityKey, string> = {
    commercial: '商业使用',
    modification: '修改',
    distribution: '分发',
    private: '私有使用',
    patent: '专利保护',
    copyleft: 'Copyleft强度'
  };

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

  const handleOpenDetail = (license: License) => {
    setSelectedLicense(license);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  const truncateSummary = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filteredLicenses = licenses.filter((license: License) =>
    license.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    Object.entries(filters).every(([key, value]) =>
      license.compatibility[key as CompatibilityKey] >= value
    )
  );

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
        开源许可证探索器
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 4,
          flexWrap: 'nowrap', // 防止换行
          alignItems: 'center', // 垂直居中对齐按钮
        }}
      >
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
        <Button
          variant="contained"
          startIcon={<Filter />}
          sx={{ minWidth: 100 }} // 确保按钮宽度
        >
          筛选
        </Button>
        {selectedLicenses.length > 1 && (
          <Button
            variant="contained"
            startIcon={<GitCompare />}
            onClick={handleOpenComparison}
            sx={{ minWidth: 100 }} // 确保按钮宽度
          >
            比较
          </Button>
        )}
      </Box>


      <Grid container spacing={3}>
        {filteredLicenses.map((license) => (
          <Grid item xs={12} sm={6} md={4} key={license.keyword}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                avatar={
                  <Avatar src={license.logo} alt={`${license.name} logo`}>
                    {license.name.charAt(0)}
                  </Avatar>
                }
                title={
                  <Typography variant="h6" color="primary">
                    {license.name}
                  </Typography>
                }
                subheader={license.keyword}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {truncateSummary(license.summary, 120)}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    {Object.entries(license.compatibility as Record<CompatibilityKey, number>).map(([key, value]) => (
                      <Grid item xs={6} key={key}>
                        <Tooltip title={`${compatibilityLabels[key as CompatibilityKey]}: ${value}/5`}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ minWidth: '80px', fontSize: '0.75rem', color: compatibilityColors[key as CompatibilityKey] }}>
                              {compatibilityLabels[key as CompatibilityKey]}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={value * 20}
                              sx={{ flexGrow: 1, ml: 1, height: 8, borderRadius: 5 }}
                            />
                          </Box>
                        </Tooltip>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">热门项目：</Typography>
                  {license.popular_projects.slice(0, 2).map((project) => (
                    <Chip
                      key={project.name}
                      label={project.name}
                      size="small"
                      sx={{ mr: 1, mt: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  startIcon={<Info />}
                  onClick={() => handleOpenDetail(license)}
                >
                  详情
                </Button>
                <Button
                  variant={selectedLicenses.includes(license) ? "contained" : "outlined"}
                  onClick={() => handleLicenseToggle(license)}
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

      <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        <DialogTitle>{selectedLicense?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedLicense?.tldrlegal_analysis}
          </Typography>
          <Typography variant="subtitle1">完整许可证文本：</Typography>
          {selectedLicense?.full_text_url && (
            <Button
              href={selectedLicense.full_text_url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              color="primary"
            >
              查看完整许可证
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>关闭</Button>
        </DialogActions>
      </Dialog>

      <LicenseDetailDialog
        license={selectedLicense}
        open={detailOpen}
        onClose={handleCloseDetail}
      />
    </Box>
  );
};

export default LicenseExplorer;
