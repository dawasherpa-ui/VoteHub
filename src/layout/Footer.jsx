import { Box, Dialog, List, ListItemButton, Typography } from "@mui/material";
import React, { useState, useContext } from "react";
import PublicIcon from "@mui/icons-material/Public";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { Context } from "../tools/AuthContext";
import { useLocation } from "react-router-dom";
export default function Footer() {
  const { tabFeed } = useContext(Context);
  const [tab1, setTab1] = useState(false);
  const [tab2, setTab2] = useState(true);
  const [tab3, setTab3] = useState(false);
  const handleTab1 = () => {
    setTab1(true);
    tabFeed(1);
    setTab2(false);
    setTab3(false);
  };
  const handleTab2 = () => {
    setTab1(false);
    setTab2(true);
    tabFeed(2);
    setTab3(false);
  };
  const handleTab3 = () => {
    setTab1(false);
    tabFeed(3);
    setTab2(false);
    setTab3(true);
  };
  return (
    <footer>
      {useLocation().pathname==="/"?
      <>      
      <Box sx={{ height: "60px", display: { xs: "flex", sm: "none" } }}></Box>
      <Box
        sx={{
          display: { xs: "flex", width: "100%", sm: "none" },
          borderTop: "1px solid white",
          position: "fixed",
          backgroundColor: "background.default",
          height: "60px",
          bottom: "0px",
        }}
      >
        <List sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <ListItemButton
            onClick={handleTab1}
            sx={
              tab1
                ? {
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    top: "-10px",
                    color: "green",
                    height: "50px",
                  }
                : { flex: 1, display: "flex", justifyContent: "center" }
            }
          >
            <PeopleAltOutlinedIcon sx={{ width: "100%", height: "100%" }} />
          </ListItemButton>
          <ListItemButton
            onClick={handleTab2}
            sx={
              tab2
                ? {
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    top: "-10px",
                    color: "green",
                    height: "50px",
                  }
                : { flex: 1, display: "flex", justifyContent: "center" }
            }
          >
            <PublicIcon sx={{ width: "100%", height: "100%" }} />
          </ListItemButton>
          <ListItemButton
            onClick={handleTab3}
            sx={
              tab3
                ? {
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    top: "-10px",
                    color: "green",
                    height: "50px",
                  }
                : { flex: 1, display: "flex", justifyContent: "center" }
            }
          >
            <PersonAddOutlinedIcon sx={{ width: "100%", height: "100%" }} />
          </ListItemButton>
        </List>
      </Box>
      </>

      :<Box component="footer" sx={{ backgroundColor: 'background.default', height:"90px",display:"grid",placeItems:"center" }}>
      <Typography variant='h6' sx={{color:"text.primary", fontSize: { xs: "17px", sm: "20px", md: "20px" },padding:"20px"}}>&copy; 2023 VoteHub. All rights reserved.</Typography>
  </Box>}
    </footer>
  );
}
