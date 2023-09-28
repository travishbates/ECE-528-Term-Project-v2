import { Container } from '@mui/material'
import './App.css'
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from "@mui/material/Drawer";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function App() {
    const [open, setOpen] = React.useState(false);

    function openDrawer() {
        setOpen(true);
    }

    function closeDrawer() {
        setOpen(false);
    }

    return (
    <>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    color="inherit"
                    onClick={openDrawer}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h5" sx={{ flexGrow: 1 }}>Gains Tracker</Typography>

                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
        >
            <IconButton
                color="inherit"
                onClick={closeDrawer}
            >
                <ChevronLeftIcon  />
            </IconButton>
            <p>Drawer placeholder</p>
        </Drawer>
        <Container>
            Welcome to Gains Tracker!
        </Container>
    </>
  )
}

export default App
