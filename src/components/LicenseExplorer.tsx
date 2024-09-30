import React, { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Button, 
  TextField, 
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
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
    <div>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="搜索许可证..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={3}>
        {filteredLicenses.map((license: License) => (
          <Grid item xs={12} sm={6} md={4} key={license.keyword}>
            <Card>
              <CardHeader 
                title={
                  <Link component={RouterLink} to={`/license/${license.keyword}`}>
                    {license.name}
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
          </Grid>
        ))}
      </Grid>

      {selectedLicenses.length > 0 && (
        <Typography variant="h6" sx={{ mt: 4 }}>
          Selected Licenses: {selectedLicenses.map(l => l.name).join(', ')}
        </Typography>
      )}
    </div>
  );
};

export default LicenseExplorer;