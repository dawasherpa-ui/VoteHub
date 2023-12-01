import React, { useState } from "react";
import { auth, login} from "../tools/Firebase";
import { Box, Button, FormControl, Snackbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState(false)
  const navigate=useNavigate()
  const handleSubmit= async(e)=>{
    e.preventDefault();
    setError(false)
    try {
      await login(email, password)
      .then((result) => {
        setError(false)
        navigate("/");
      })
      .catch((error) => {
        setError(true)
        console.log("error : ",error); // This is where you catch and handle the error
      });
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Box
      sx={{
        height: "90vh",
        width: "100%",
        display: "grid",
        placeItems: "center",
        
      }}
    >
      <Box sx={{border:`${error?"1px solid red":"1px solid white"}`,paddingBlock:"25px",paddingInline:{xs:"3vw",sm:"20px"}}}>
        <FormControl
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
        >
          <Typography
            variant="h5"
            sx={{ textAlign: "center", marginBottom: "10px" }}
          >
            Login
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
               width: {xs:"100%",sm:"350px"},
            }}
          >
            <Typography
              component="label"
              htmlFor="email"
              sx={{ flexGrow:1, textAlign: "center",fontSize:{xs:"14px",sm:"16px"}  }}
            >
              Email{" "}
            </Typography>
            <input
              style={{ padding: "10px", fontSize: "16px" ,backgroundColor:"white"}}
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              id="email"
              type="email"
              placeholder="user@gmail.com"
              required
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
               width: {xs:"100%",sm:"350px"},
            }}
          >
            <Typography
              component="label"
              htmlFor="password"
              sx={{ flexGrow:1, textAlign: "center",fontSize:{xs:"14px",sm:"16px"}  }}
            >
              Password{" "}
            </Typography>
            <input
              id="password"
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              style={{ padding: "10px", fontSize: "16px" ,backgroundColor:"white"}}
              type="password"
              placeholder="Password"
              required
            />
          </Box>
          <Box sx={{ alignSelf: "center",marginTop:"10px" }}>
            <Button type="submit" variant="contained">Log In</Button>
          </Box>
        </FormControl>
        <Box sx={{display:"grid",placeItems:"center",marginTop:"15px"}}>
         <Typography sx={{fontSize:{xs:"14px",sm:"16px"} }}>Doesn't have account?<Link to="/signin" >Sign In</Link></Typography>
         <Typography sx={{fontSize:"12px",color:"red"}}>{error?"Password Incorrect!":null}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
