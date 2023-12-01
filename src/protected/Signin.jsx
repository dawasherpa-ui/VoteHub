import React, { useState } from "react";
import { signInWithGoogle, signin } from "../tools/Firebase";
import { Avatar, Box, Button, FormControl, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Google from '../image/google.png'
import { supabase } from "../tools/Supabase";
export default function Signin() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]=useState(false)
  const navigate = useNavigate();


const supabaseDB=async(e)=>{
  console.log("result",e.user.displayName)
  const uuid=e.user?.uid;
  const profileName=e.user?.displayName;
  const profileEmail=e.user?.email;
  console.log(uuid)
  const {data,error}= await supabase
  .from("profile")
  .insert({ uid: uuid, name: profileName, email: profileEmail, following:["FAVR3QIUj1frkTJiVC1oIdcJljA3"],followers :[]})
  if (data){
    console.log(data)
  }else{
    console.log(error)
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false)
    try {
      await signin(email, password, name)
      .then((result)=>{
        setError(false)
        supabaseDB(result)
        navigate("/");
      }
      ).catch((err)=>{
        setError(true)
      })
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {}
  };
  const signInGoogle = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Box
      sx={{
        height: "90vh",
        width: "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box
        sx={{
          border: "1px solid white",
          paddingBlock: "25px",
          paddingInline: {xs:"3vw",sm:"20px"},
        }}
      >
        <FormControl
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
        >
          <Typography
            variant="h5"
            sx={{ textAlign: "center", marginBottom: "10px" }}
          >
            Create Account
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
              htmlFor="name"
              sx={{ flexGrow:1, textAlign: "center",fontSize:{xs:"14px",sm:"16px"} }}
            >
              Name{" "}
            </Typography>
            <input
              style={{ padding: "10px", fontSize: "16px",backgroundColor:"white"}}
              onChange={(e) => setName(e.target.value)}
              value={name}
              id="name"
              type="text"
              maxLength="100"
              placeholder="John Walter"
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
              htmlFor="email"
              sx={{ flexGrow:1, textAlign: "center",fontSize:{xs:"14px",sm:"16px"} }}
            >
              Email{" "}
            </Typography>
            <input
              style={{ padding: "10px", fontSize: "16px",backgroundColor:"white"}}
              onChange={(e) => setEmail(e.target.value)}
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
              sx={{ flexGrow:1, textAlign: "center",fontSize:{xs:"14px",sm:"16px"} }}
            >
              Password{" "}
            </Typography>
            <input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              style={{ padding: "10px", fontSize: "16px",backgroundColor:"white"}}
              type="password"
              placeholder="Password"
              required
            />
          </Box>
          <Box sx={{ alignSelf: "center", marginTop: "10px" }}>
            <Button type="submit" variant="contained">
              create
            </Button>
          </Box>
        </FormControl>
        <Box sx={{ display: "grid", placeItems: "center", marginTop: "15px" }}>
          <Typography sx={{fontSize:{xs:"14px",sm:"16px"}}}>
            Already have an account?{" "}<Link to="/login">Log In</Link>
          </Typography>
          <Typography sx={{fontSize:"12px",color:"red"}}>
            {error?"Account already exist!":null}
          </Typography>
        </Box>
        <Box sx={{ display: "grid", placeItems: "center", marginTop: "15px" }}>
          <Button onClick={signInGoogle} variant="outlined" sx={{px:1,py:{xs:0,sm:1}}}>
            <Avatar src={Google}/><Typography sx={{fontSize:{xs:"14px",sm:"16px"}}}>Sign In Google</Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
