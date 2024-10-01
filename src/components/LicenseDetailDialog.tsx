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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow
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

  // 提取 summary 中第一个句号前的内容
  const extractSummaryIntro = (text: string) => {
    const periodIndex = text.indexOf('。');
    return periodIndex > 0 ? text.substring(0, periodIndex + 1) : text;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* 左侧图标和标题 */}
          <Box display="flex" alignItems="center">
            {license.logo && (
              <Box sx={{ width: 60, height: 60, marginRight: 2 }}>
                <img src={license.logo} alt={`${license.name} logo`} width="100%" height="100%" />
              </Box>
            )}
            <Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {license.name}
              </Typography>
              {/* 提取 summary 的第一句 */}
              <Typography variant="body2" color="textSecondary">
                {extractSummaryIntro(license.summary || license.spdx_description)}
              </Typography>
            </Box>
          </Box>

          {/* 右侧兼容性指标表格 */}
          <Box>
            <Table size="small" sx={{ minWidth: 200 }}>
              <TableBody>
                {Object.entries(license.compatibility).map(([key, value], index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2">{compatibilityLabels[key as keyof typeof compatibilityLabels]}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      {/* 用进度条展示评分 */}
                      <LinearProgress
                        variant="determinate"
                        value={value * 20}  // 进度条的值从0到100，所以将5分制乘以20
                        sx={{ 
                          height: 8, 
                          borderRadius: 5,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: compatibilityColors[key as keyof typeof compatibilityColors]
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          <ReactMarkdown>
            {license.summary || license.spdx_description}
          </ReactMarkdown>
          
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
