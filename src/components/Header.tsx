import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          开源许可证探索器
        </Typography>
        <Link href="/" passHref>
          <Button component="a">首页</Button>
        </Link>
        <Link href="/About" passHref>
          <Button component="a">关于</Button>
        </Link>
        {/* GitHub 链接按钮 */}
        <IconButton
          component="a"
          href="https://github.com/iaiuse/open-source-license-explorer" // 将此链接替换为您的 GitHub 仓库链接
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
        >
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
