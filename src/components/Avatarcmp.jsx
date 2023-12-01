import React, { useEffect, useState } from "react";
import { auth } from "../tools/Firebase";
import { Avatar, Box } from "@mui/material";
import { supabase } from '../tools/Supabase';
import { Link } from "react-router-dom";

export default function Avatarcmp({ uid }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getImages();
  }, []);
  const uRL = "https://ldgnpdudaohjifgktmst.supabase.co/storage/v1/object/public/profileImg/";

  const getImages = async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('profileImg')
        .list(`${uid}/`, {
          limit: 10,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setImages(data);
      }
    } catch (e) {
      console.error("An error occurred:", e);
    }
  };

  return (
    <Box>
      <Link to={`/${uid}`}>
        <Avatar src={images && images.length > 0 && images[0]?.name ? `${uRL + uid}/${images[0]?.name}` : auth.currentUser.photoURL} />
      </Link>
    </Box>
  );
}
