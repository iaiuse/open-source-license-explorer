import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          开源许可证探索器
        </Typography>
        <Link href="/" passHref>
          <Button color="inherit" component="a">首页</Button>
        </Link>
        <Link href="/About" passHref>
          <Button color="inherit" component="a">关于</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;