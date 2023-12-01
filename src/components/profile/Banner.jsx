import React, { useEffect, useState } from 'react'
import { supabase } from '../../tools/Supabase';
import {  Box, Typography } from '@mui/material';
import VerifiedIcon from "@mui/icons-material/Verified";
import Avatarcmp from '../Avatarcmp';
import { Link, useNavigate } from 'react-router-dom';
export default function Banner({info,event}) {
    const [details,setDetails]=useState([])
    const uid=info;
    const navigate=useNavigate()
    const getDetail = async () => {
        const { data, error } = await supabase
          .from("profile")
          .select("uid,name,verified")
          .eq("uid", uid);
        if (data) {

          setDetails(data[0]);

        } else {
          console.log(error);
        }
    };
    const handleRedirect = async() => {
        await event();
        navigate(`/${uid}`)
      }
    useEffect(() => {
        getDetail();
      }, []);
  return (
    <Box sx={{height:"40px",width:"100%",display:"flex",justifyContent:"start",alignItems:"center"}} onClick={handleRedirect}>
        <Avatarcmp uid={info} />
        
        <Typography sx={{marginLeft:"10px",fontSize:{xs:"13px",sm:"16px"},cursor:"pointer"}}><Link to={`/${uid}`} style={{color:"white"}}>{details?.name} </Link></Typography>
        {details?.verified === true ? (
                  <VerifiedIcon
                    sx={{ color: "primary.main", height: "22px" }}
                  />
                ) : null}
               
    </Box>
  )
}

