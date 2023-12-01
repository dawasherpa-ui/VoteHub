import React from "react";
import Home from "../page/Home";
import { Route, Routes, useParams } from "react-router-dom";
import Login from "../protected/Login";
import Signin from "../protected/Signin";
import { Protected } from "../protected/Protected";
import Profile from "../page/Profile";
import { Box } from "@mui/material";
import Support from "../page/Support";
import Home2 from "../page/Home2";

export default function Main() {
  return (
    <main >
        <Box sx={{height:"auto",backgroundColor:"background.default"}}>
      <Routes>
        <Route exact path="/" element={<Protected><Home /></Protected>} />
        <Route exact path="/:id" element={<Protected><ProfileWrapper /></Protected>} />
        <Route exact path="/support" element={<Protected><Support /></Protected>} />
        <Route exact path="/home" element={<Home2/>} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signin" element={<Signin />} />
      </Routes>
        </Box>
    </main>
  );
}

function ProfileWrapper() {
  const { id } = useParams();
  // You can now pass the 'id' as a prop to the Profile component
  return <Profile uid={id} />;
}
