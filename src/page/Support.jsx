import { Box, Link, Typography } from '@mui/material'
import Lottie from 'lottie-react'
import React from 'react'
import SvgAnimation from '../assets/Animation - 1701015383894.json'
export default function Support() {
  return (
    <Box sx={{height:"87vh"}}>
    <Box sx={{height:"100%",display:"flex",alignItems:"center",flexDirection:{xs:"column",sm:"row"},paddingTop:{xs:"30px",sm:"0px"}}}>
    <Box sx={{display:"flex",width:{xs:"90vw",sm:"40vw"}}}>
      <Lottie animationData={SvgAnimation} style={{height:"100%",width:"100%"}}/>
    </Box>
    <Box sx={{width:{xs:"100%",sm:"60vw"},height:"100%",display:"grid",placeItems:"center",p:"20px"}}>
      <Box >
      <Typography variant='h4' sx={{fontSize:{xs:"28px",sm:"32px",md:"38px"},textAlign:"center",marginBottom:"10px"}}>Support & Care</Typography>
    <Typography>As this is a simple project to help users to figure out there choice. The VoteHub doesn't have feature of re-newing password, account recovery or report. To report or the account recovery, re-new password. Plz contact in provided email.</Typography>
    <Link href="mailto:jamudawa22@gmail.com" target="_blank_">jamudawa22@gmail.com</Link>
    </Box>
    </Box>
    </Box>
    </Box>
  )
}
