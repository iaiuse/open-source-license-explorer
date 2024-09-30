import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';
import licenses from '../data/licenses.json';
import { License } from '../types';

const LicenseSelector: React.FC = () => {
  const [selectedLicense, setSelectedLicense] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedLicense(event.target.value as string);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>Select a License</InputLabel>
        <Select value={selectedLicense} onChange={handleChange}>
          {(licenses as License[]).map((license) => (
            <MenuItem key={license.keyword} value={license.keyword}>
              {license.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedLicense && (
        <Button variant="contained" color="primary" href={`/license/${selectedLicense}`}>
          View Details
        </Button>
      )}
    </div>
  );
};

export default LicenseSelector;