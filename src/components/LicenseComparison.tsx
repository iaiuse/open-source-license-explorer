import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';
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

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>特性</TableCell>
            {selectedLicenses.map((license) => (
              <TableCell key={license.keyword}>{license.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(compatibilityLabels).map(([key, label]) => (
            <TableRow key={key}>
              <TableCell>{label}</TableCell>
              {selectedLicenses.map((license) => (
                <TableCell key={`${license.keyword}-${key}`}>
                  {license.compatibility[key as keyof typeof license.compatibility]}/5
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default LicenseComparison;