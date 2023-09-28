import { Container } from '@mui/material'
import './App.css'
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';

function App() {
  return (
    <>
        <AppBar position="static">
            <Toolbar>
                <IconButton color="inherit">
                    <MenuIcon />
                </IconButton>

                <Typography variant="h5" sx={{ flexGrow: 1 }}>Gains Tracker</Typography>

                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
        <Container>
            Welcome to Gains Tracker!
        </Container>
    </>
  )
}

export default App
