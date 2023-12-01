import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { supabase } from "../../tools/Supabase";
import Cards from "./Cards";
export default function Suggestion() {
  const [details,setDetails]=useState([])
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1024 },
      items: 5,
      slidesToSlide: 2,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items:5,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 4,
    },
  };

  async function fetchLimitedData() {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(10); // Specify the number of records you want to fetch
  
    if (error) {
      console.error(error);
      return;
    }
  
    console.log(data);
    setDetails(data)
  }
  useEffect(()=>{
    
    fetchLimitedData();
  },[])

  return (
    <Box
      sx={{
        height: "100%",
        padding: "20px",
        // width: { xs: "400px", md: "900px" },
        width:"100%"
      }}
    >
      <Carousel showDots={true} responsive={responsive}>
        {details?.map((e)=>
        <Cards/>
        )}
      </Carousel>
    </Box>
  );
}
