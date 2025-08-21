import { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Drawer, 
  Toolbar, 
  Typography, 
  IconButton, 
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Map from './components/Map';
import ControlPanel from './components/ControlPanel';
import { DroneService } from './services/DroneService';
import './App.css';

function App() {
  const theme = useTheme();
  const [opened, setOpened] = useState(false);
  const [droneState, setDroneState] = useState({
    battery: 0,
    altitude: 0,
    speed: 0,
    latitude: 51.505,
    longitude: -0.09,
    heading: 0,
    status: 'disconnected',
    mode: 'GUIDED'
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Start polling for drone telemetry
  useEffect(() => {
    const stopPolling = DroneService.startPolling((data) => {
      setDroneState(data);
    });

    return () => stopPolling();
  }, []);

  // Handle drone commands
  const handleCommand = async (command) => {
    const result = await DroneService.sendCommand(command);
    if (result.status === 'error') {
      setNotification({
        open: true,
        message: result.message || 'Command failed',
        severity: 'error'
      });
    } else {
      setNotification({
        open: true,
        message: `Command ${command} sent successfully`,
        severity: 'success'
      });
    }
  };

  // Mock data for stats
  const stats = [
    { title: 'Status', value: droneState.status },
    { title: 'Battery', value: `${droneState.battery}%` },
    { title: 'Altitude', value: `${droneState.altitude}m` },
    { title: 'Speed', value: `${droneState.speed} m/s` },
    { title: 'GPS', value: `${droneState.latitude.toFixed(6)}, ${droneState.longitude.toFixed(6)}` },
    { title: 'Heading', value: `${droneState.heading}°` },
    { title: 'Mode', value: droneState.mode },
  ];

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setOpened(!opened)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Drone Control Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth,
            boxSizing: 'border-box',
            display: { xs: opened ? 'block' : 'none', sm: 'block' }
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          {stats.map((stat) => (
            <Card key={stat.title} sx={{ mb: 2 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h5" component="div">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ height: 'calc(100vh - 100px)' }}>
              <Map position={[droneState.latitude, droneState.longitude]} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <ControlPanel onCommand={handleCommand} />
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
