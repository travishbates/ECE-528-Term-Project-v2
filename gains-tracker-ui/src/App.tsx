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
import TransactionTable from "./TransactionTable";
import TransactionUpload from "./TransactionUpload";
import { getTransactions } from "./backendService";
import SideNav from "./SideNav";
import {Routes, Route, useNavigate} from "react-router-dom";
import Reports from "./Reports";

function App() {
    const [transactions, setTransactions] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    function openDrawer() {
        setOpen(true);
    }

    function closeDrawer() {
        setOpen(false);
    }

    function refreshTransactions() {
        getTransactions()
            .then((result) => {
                setTransactions(result.result);
            });
    }

    const handleNavigate = (route) => {
        navigate(route);
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
        <SideNav open={ open } closeDrawer={ closeDrawer } handleNavigate={handleNavigate}/>
        <Container>
            <Routes>
                <Route path="/" element={<p>
                    Welcome to Gains Tracker!
                </p>}/>
                <Route path="/transactions" element={<TransactionTable transactions={transactions} refreshTransactions={refreshTransactions}></TransactionTable>}/>
                <Route path="/reports" element={<Reports></Reports>}/>
            </Routes>
        </Container>
    </>
  )
}

export default App
