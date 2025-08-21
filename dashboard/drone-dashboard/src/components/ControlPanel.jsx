import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import HomeIcon from '@mui/icons-material/Home';
import StopCircleIcon from '@mui/icons-material/StopCircle';

function ControlPanel() {
  const handleControl = (command) => {
    onCommand(command);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Flight Controls
      </Typography>
      
      {/* Main Controls */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<FlightTakeoffIcon />}
            onClick={() => handleControl('takeoff')}
          >
            Take Off
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<FlightLandIcon />}
            onClick={() => handleControl('land')}
          >
            Land
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => handleControl('return')}
          >
            Return
          </Button>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<StopCircleIcon />}
            onClick={() => handleControl('emergency')}
          >
            Emergency
          </Button>
        </Grid>
      </Grid>

      {/* Directional Controls */}
      <Box sx={{ maxWidth: 300, margin: '0 auto' }}>
        <Grid container spacing={1}>
          {/* Up */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => handleControl('up')}
              sx={{ minWidth: 100 }}
            >
              <ArrowUpwardIcon />
            </Button>
          </Grid>
          
          {/* Left, Down, Right */}
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => handleControl('left')}
              sx={{ minWidth: 100 }}
            >
              <ArrowBackIcon />
            </Button>
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => handleControl('down')}
              sx={{ minWidth: 100 }}
            >
              <ArrowDownwardIcon />
            </Button>
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="outlined"
              onClick={() => handleControl('right')}
              sx={{ minWidth: 100 }}
            >
              <ArrowForwardIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default ControlPanel;
