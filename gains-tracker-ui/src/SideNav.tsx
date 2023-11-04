import * as React from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";

interface SideNavProps {
    open: boolean,
    closeDrawer: () => void,
    handleNavigate: (route: string) => void
}
const SideNav: React.FC<SideNavProps> = ({ open, closeDrawer, handleNavigate }) => {
    return (
        <>
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
                <List>
                    <ListItemButton onClick={() => handleNavigate("./")}>Home</ListItemButton>
                    <ListItemButton onClick={() => handleNavigate("./transactions")}>Transactions</ListItemButton>
                    <ListItemButton onClick={() => handleNavigate("./reports")}>Reports</ListItemButton>
                    {/*<ListItemButton onClick={() => handleNavigate("./chat")}>Chat</ListItemButton>*/}
                </List>
            </Drawer>
        </>
    )
}

export default SideNav
