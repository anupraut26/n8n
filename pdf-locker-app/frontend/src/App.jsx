import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockPanel from './LockPanel';
import UnlockPanel from './UnlockPanel';

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          PDF Locker & Unlocker
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab icon={<LockIcon />} label="Lock PDF" />
            <Tab icon={<LockOpenIcon />} label="Unlock PDF" />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {tabIndex === 0 && <LockPanel />}
          {tabIndex === 1 && <UnlockPanel />}
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
