import React from "react";
import Navbar from "./layout/Navbar";
import Main from "./layout/Main";
import Footer from "./layout/Footer";
import { Box, ThemeProvider } from "@mui/material";
import {  darkTheme } from "./Theme.jsx";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthContext } from "./tools/AuthContext";

function App() {
  return (
    <AuthContext>
    <ThemeProvider theme={darkTheme}>

        <Box
          sx={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            overflowY:"auto",
            color:"text.primary",
            overflowX:"hidden",
            backgroundColor:"background.default"
          }}
        >
          <Navbar />
          <Main />
          <Footer />
        </Box>
    </ThemeProvider>
    </AuthContext>
  );
}

export default App;
