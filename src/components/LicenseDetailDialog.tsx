import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography, 
  Box, 
  Button, 
  Chip,
  Grid,
  LinearProgress,
  Tooltip,
  Divider
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { License } from '../types';

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

interface LicenseDetailDialogProps {
  license: License | null;
  open: boolean;
  onClose: () => void;
}

const LicenseDetailDialog: React.FC<LicenseDetailDialogProps> = ({ license, open, onClose }) => {
  if (!license) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            // 背景颜色和透明度
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '5px',
            padding: '10px',
            mb: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `url(${license.logo}) no-repeat center/contain`,
              opacity: 0.1, // 控制徽标的透明度
              zIndex: 1,
            },
            zIndex: 2 // 确保其他内容显示在背景图上方
          }}
        >
          <Typography variant="h6" sx={{ zIndex: 2 }}>
            {license.name}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <ReactMarkdown>
          {license.summary || license.spdx_description}
        </ReactMarkdown>
        
        <Typography variant="subtitle1" gutterBottom>兼容性指标：</Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {Object.entries(license.compatibility).map(([key, value]) => (
            <Grid item xs={6} key={key}>
              <Tooltip title={`${compatibilityLabels[key as keyof typeof compatibilityLabels]}: ${value}/5`}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ minWidth: '80px', fontSize: '0.75rem' }}>
                    {compatibilityLabels[key as keyof typeof compatibilityLabels]}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={value * 20} 
                    sx={{ 
                      flexGrow: 1, 
                      ml: 1,
                      height: 6,
                      borderRadius: 3,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: compatibilityColors[key as keyof typeof compatibilityColors]
                      }
                    }} 
                  />
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>分析：</Typography>
        <Box sx={{ '& > p': { marginBottom: 2 } }}>
          <ReactMarkdown>
            {license.tldrlegal_analysis}
          </ReactMarkdown>
        </Box>
        
        <Divider sx={{ my: 2 }} />

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
              size="small"
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          variant="outlined" 
          href={license.full_text_url} 
          target="_blank"
        >
          查看完整许可证文本
        </Button>
        <Button onClick={onClose} variant="contained">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LicenseDetailDialog;
