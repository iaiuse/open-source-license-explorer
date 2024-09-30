import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import licenses from '../data/licenses.json';
import { License } from '../types';

const LicenseComparison: React.FC = () => {
  const [selectedLicenses, setSelectedLicenses] = useState<License[]>([]);

  // Check if the licenses have attributes and safely access them
  const getAttributes = (license: License) => license.attributes || {};

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Feature</TableCell>
            {selectedLicenses.map((license) => (
              <TableCell key={license.keyword}>{license.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedLicenses.length > 0 && 
            Object.keys(getAttributes(selectedLicenses[0])).map((attr) => (
              <TableRow key={attr}>
                <TableCell>{attr}</TableCell>
                {selectedLicenses.map((license) => (
                  <TableCell key={`${license.keyword}-${attr}`}>
                    {getAttributes(license)[attr] ? 'Yes' : 'No'}
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
