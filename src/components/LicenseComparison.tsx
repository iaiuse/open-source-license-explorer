import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, LinearProgress, Tooltip } from '@mui/material';
import { License } from '../types';

interface LicenseComparisonProps {
  selectedLicenses: License[];
}

const LicenseComparison: React.FC<LicenseComparisonProps> = ({ selectedLicenses }) => {
  if (selectedLicenses.length === 0) {
    return <Typography>请选择许可证进行比较</Typography>;
  }

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

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>许可证</TableCell>
            {Object.entries(compatibilityLabels).map(([key, label]) => (
              <TableCell key={key}>{label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedLicenses.map((license) => (
            <TableRow key={license.keyword}>
              <TableCell>{license.name}</TableCell>
              {Object.entries(compatibilityLabels).map(([key]) => {
                const value = license.compatibility[key as keyof typeof license.compatibility];
                return (
                  <TableCell key={`${license.keyword}-${key}`}>
                    <Tooltip title={`${value}/5`} arrow>
                      <LinearProgress
                        variant="determinate"
                        value={(value / 5) * 100}
                        sx={{
                          height: 10,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: compatibilityColors[key as keyof typeof compatibilityColors]
                          }
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default LicenseComparison;
