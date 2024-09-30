import React, { useState } from 'react';
import { 
  Box,
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Button, 
  TextField
} from '@mui/material';
import Link from 'next/link';
import licenses from '../data/licenses.json';
import { License } from '../types';

const LicenseExplorer: React.FC = () => {
  const [selectedLicenses, setSelectedLicenses] = useState<License[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLicenseToggle = (license: License) => {
    setSelectedLicenses(prev => 
      prev.includes(license) 
        ? prev.filter(l => l !== license)
        : [...prev, license].slice(-3)
    );
  };

  const filteredLicenses = licenses.filter((license: License) => 
    license.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="搜索许可证..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {filteredLicenses.map((license: License) => (
          <Box key={license.keyword} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
            <Card>
              <CardHeader 
                title={
                  <Link href={`/license/${license.keyword}`} passHref>
                    <Typography component="a" variant="h6" color="primary" sx={{ textDecoration: 'none' }}>
                      {license.name}
                    </Typography>
                  </Link>
                } 
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {license.description}
                </Typography>
                {license.attributes && (
                  <Typography variant="body2" color="text.secondary">
                    Attributes: {Object.keys(license.attributes).filter(key => license.attributes![key]).join(', ')}
                  </Typography>
                )}
                <Button 
                  variant={selectedLicenses.includes(license) ? "contained" : "outlined"}
                  onClick={() => handleLicenseToggle(license)}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {selectedLicenses.includes(license) ? '取消选择' : '选择比较'}
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {selectedLicenses.length > 0 && (
        <Typography variant="h6" sx={{ mt: 4 }}>
          Selected Licenses: {selectedLicenses.map(l => l.name).join(', ')}
        </Typography>
      )}
    </Box>
  );
};

export default LicenseExplorer;