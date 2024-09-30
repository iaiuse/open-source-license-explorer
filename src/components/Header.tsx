import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          开源许可证探索器
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          首页
        </Button>
        <Button color="inherit" component={RouterLink} to="/about">
          关于
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;