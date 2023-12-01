import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import Home from "../image/home.png";
import LockIcon from "@mui/icons-material/Lock";
import WebhookIcon from "@mui/icons-material/Webhook";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import Lottie from 'lottie-react'
import SvgAnimation from '../assets/Animation - 1701015383894.json'
import { useNavigate } from "react-router-dom";
export default function Home2() {
  const navigate=useNavigate()
  return (
    <Box>
      <Box
        sx={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,213,255,0.5) 0%, rgba(108,9,121,0.5) 100%)",
          height: {xs:"500px",md:"550px"},
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          display:"flex",
          flexDirection:"column",
          gap:{xs:"5px",md:"0px"},
          justifyContent:"center",
          backgroundSize: "cover",
          px: { xs: 3, sm: 5, md: 7 },
          paddingBottom:"70px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, y: 30, x: 0 }}
          transition={{ ease: "easeOut", delay: 0.2 }}
        >
          <Typography variant="h3" sx={{fontSize:"6.2vw"}}>VoteHub</Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, y: 30, x: 0 }}
          transition={{ ease: "easeInOut", duration: 0.6, delay: 0.3 }}
        >
          <Typography variant="h1" sx={{fontSize:"10vw"}}>Introduction ?</Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, y: 30, x: 0 }}
          transition={{ ease: "easeInOut", duration: 0.6, delay: 0.5 }}
        >
          <Box sx={{ width: { xs: "70vw", md: "65vw" }}}>
            <Typography variant="h6" sx={{fontSize:{xs:"4vw",sm:"19px"}}}>
              VoteHub is a voting platform to vote the prefered choice of user.
              It was built with the vision of helping user to choose their best
              option.{" "}
            </Typography>
            <Button variant="contained" onClick={()=>{navigate("/signin")}} sx={{ bgcolor: "background.paper",marginTop:"10px" }}>
              Sign In
            </Button>
          </Box>
        </motion.div>
      </Box>
      <Box
        sx={{
          height: {xs:"auto",md:"600px"},
          display: "grid",
          gridTemplateColumns: {xs:"1fr",md:"1fr 1fr"},
          gridTemplateRows:{xs:"1fr 1fr",md:"1fr"},
          alignItems: "center",
          justifyItems: "center",
          p:{xs:3,sm:0}
        }}
      >
        <Box sx={{justifySelf:{xs:"start"},px:{xs:0,sm:3}}}>
          <motion.div
            initial={{ opacity: 0, y: -30, x: 100 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{ ease: "easeInOut", duration: 0.6, delay: 0.1 }}
          >
            <Typography variant="h3" sx={{fontSize:"6.2vw"}}>#Features</Typography>
          </motion.div>
          <List  >
            <motion.div
              initial={{ opacity: 0, y: -30, x: 100 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ ease: "easeInOut", duration: 0.6, delay: 0.3 }}
            >
              <ListItem >
                <ListItemIcon sx={{ minWidth: "auto", marginRight: "5px" }}>
                  <LockIcon sx={{ color: "text.primary",fontSize:{xs:"5vw",sm:"19px"} }} />
                </ListItemIcon>
                <Typography sx={{fontSize:{xs:"4vw",sm:"19px"}}}>Secure</Typography>
              </ListItem>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -30, x: 100 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ ease: "easeInOut", duration: 0.6, delay: 0.4 }}
            >
              <ListItem >
                <ListItemIcon sx={{ minWidth: "auto", marginRight: "5px" }}>
                  <WebhookIcon sx={{ color: "text.primary",fontSize:{xs:"5vw",sm:"19px"} }} />
                </ListItemIcon>
                <Typography sx={{fontSize:{xs:"4vw",sm:"19px"}}}>Interaction</Typography>
              </ListItem>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -30, x: 100 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ ease: "easeInOut", duration: 0.6, delay: 0.5 }}
            >
              <ListItem >
                <ListItemIcon sx={{ minWidth: "auto", marginRight: "5px" }}>
                  <DesignServicesIcon sx={{ color: "text.primary",fontSize:{xs:"5vw",sm:"19px"} }} />
                </ListItemIcon>
                <Typography sx={{fontSize:{xs:"4vw",sm:"19px"}}}>Customizable</Typography>
              </ListItem>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -30, x: 100 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{ ease: "easeInOut", duration: 0.6, delay: 0.6 }}
            >
              <ListItem >
                <ListItemIcon sx={{ minWidth: "auto", marginRight: "5px" }}>
                  <ConnectWithoutContactIcon sx={{ color: "text.primary",fontSize:{xs:"5vw",sm:"19px"} }} />
                </ListItemIcon>
                <Typography sx={{fontSize:{xs:"4vw",sm:"19px"}}}>Networking</Typography>
              </ListItem>
            </motion.div>
          </List>
        </Box>
        <motion.div
          initial={{ opacity: 0, y: -30, x: 100 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          transition={{ ease: "easeInOut", duration: 0.9, delay: 0.3 }}
        >
          <Box sx={{ width: {xs:"90vw",md:"550px"} }}>
            <img src={Home} alt="image of votehub" style={{ width: "100%" }} />
          </Box>
        </motion.div>
      </Box>
      <Box sx={{height:{xs:"auto",sm:"600px"},p:{xs:5,sm:2},bgcolor:"background.paper"}}>
        <Box sx={{height:"100%",display:"flex",alignItems:"center",flexDirection:{xs:"column",sm:"row"},paddingTop:{xs:"30px",sm:"0px"}}}>
        <motion.div  initial={{ opacity: 0, y: -30, x: 100 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          transition={{ ease: "easeInOut", duration: 0.9, delay: 0.1 }}>
    <Box sx={{display:"flex",width:{xs:"90vw",sm:"40vw"}}}>
      <Lottie animationData={SvgAnimation} style={{height:"100%",width:"100%"}}/>
    </Box>
    </motion.div>
    <Box sx={{width:{xs:"100%",sm:"60vw"},height:"100%",display:"grid",placeItems:"center",p:"20px"}}>
      <Box >
        <motion.div  initial={{ opacity: 0, y: -30, x: 100 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          transition={{ ease: "easeInOut", duration: 0.6, delay: 0.4 }}>
      <Typography variant='h4' sx={{fontSize:{xs:"6.2vw",sm:"32px",md:"38px"},textAlign:"center",marginBottom:"10px"}}>Support & Care</Typography>
      </motion.div>
      <motion.div  initial={{ opacity: 0, y: -30, x: 100 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          transition={{ ease: "easeInOut", duration: 0.6, delay: 0.6 }}>
    <Typography sx={{fontSize:{xs:"3.8vw",sm:"19px"}}}>As this is a simple project to help users to figure out there choice. The VoteHub doesn't have feature of re-newing password, account recovery or report. To report or the account recovery, re-new password. Plz contact in provided email.</Typography>
    <Link sx={{fontSize:{xs:"3.8vw",sm:"19px"}}} href="mailto:jamudawa22@gmail.com" target="_blank_">jamudawa22@gmail.com</Link>
    </motion.div>
    </Box>
    </Box>
    </Box>
      </Box>
      </Box>
  );
}
