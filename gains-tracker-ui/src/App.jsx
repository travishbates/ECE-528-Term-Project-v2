import { Container } from '@mui/material'
import './App.css'
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import TransactionTable from "./TransactionTable";
import SideNav from "./SideNav";
import {Routes, Route, useNavigate} from "react-router-dom";
import Reports from "./Reports";
import Login from "./Login";
import Chat from "./Chat";
import ForgotPassword from "./ForgotPassword";
import Signup from "./Signup";
import {useAuth} from "./AuthContext";

const App = () => {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const { currentUser, logout } = useAuth()

    function openDrawer() {
        setOpen(true);
    }

    function closeDrawer() {
        setOpen(false);
    }

    const handleNavigate = (route) => {
        navigate(route);
    }

    async function handleLogout() {
        try {
            await logout()
            navigate("/login")
        } catch {
            console.log("There was an error logging out.");
        }
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

                { currentUser ?
                    <><p>{ currentUser.email }</p><Button color="inherit" onClick={() => handleLogout()}>Logout</Button></> :
                    <Button color="inherit" onClick={() => handleNavigate("./login")}>Login</Button>
                }
            </Toolbar>
        </AppBar>
        <SideNav open={ open } closeDrawer={ closeDrawer } handleNavigate={handleNavigate}/>
        <Container className={"main-container"}>
            <Routes>
                <Route path="/" element={<p>
                    Welcome to Gains Tracker! At Gains Tracker, you can upload your transactions and get reports that can help you with filing taxes.
                </p>}/>
                <Route path="/transactions" element={<TransactionTable></TransactionTable>}/>
                <Route path="/reports" element={<Reports></Reports>}/>
                <Route path="/login" element={<Login></Login>}/>
                <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}/>
                <Route path="/signup" element={<Signup></Signup>}/>
                {/*<Route path="/chat" element={<Chat></Chat>}/>*/}
            </Routes>
        </Container>
    </>
  )
}

export default App
