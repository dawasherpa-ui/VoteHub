import React, { useEffect, useRef, useState } from "react";
import { auth } from "../tools/Firebase";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { supabase } from "../tools/Supabase";
import Image from "../image/plan.jpeg";
import { v4 as uuidv4 } from "uuid";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedIcon from "@mui/icons-material/Verified";
import TabBanner from "../components/profile/TabBanner";
import Post from "../components/Post";
import TagIcon from "@mui/icons-material/Tag";
export default function Profile({ uid }) {
  const fileInputRef = useRef(null);
  const [upload, setUpload] = useState();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(1);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [check, setCheck] = useState(null);
  const [imageShow, setImageShow] = useState(false);
  const [images, setImages] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleIconClick = () => {
    fileInputRef.current.click();
  };
  const uploadBtn = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };
  const closeBanner = () => {
    setBannerOpen(false);
  };
  const toggleFollow = async (toggleUID) => {
    // First, retrieve the existing profile record to access the 'following' array
    const { data: existingProfile, error: existingError } = await supabase
      .from("profile")
      .select("followers")
      .eq("uid", uid);

    if (existingError) {
      console.error(existingError);
      return;
    }

    // Get the existing 'following' array or initialize it as an empty array
    const existingFollowers = existingProfile[0]?.followers || [];

    // Check if the toggleUID is already in the 'following' array
    const index = existingFollowers.indexOf(toggleUID);

    if (index === -1) {
      // If it's not in the array, add it
      existingFollowers.push(toggleUID);
    } else {
      // If it's in the array, remove it
      existingFollowers.splice(index, 1);
    }

    // Update the 'following' array in the profile record
    const { data, error } = await supabase
      .from("profile")
      .update({ followers: existingFollowers })
      .eq("uid", uid)
      .select();

    if (data) {
      console.log(data);
      // setFollowed(existingFollowers.includes(auth.currentUser?.uid));
      getDetail();
    } else {
      console.log(error);
    }
  };
  const handleFollowing = async (toggleUID) => {
    const { data: existingProfile, error: existingError } = await supabase
      .from("profile")
      .select("following")
      .eq("uid", toggleUID);

    if (existingError) {
      console.error(existingError);
      return;
    }
    const existingFollowing = existingProfile[0]?.following || [];
    const index = existingFollowing.indexOf(uid);

    if (index === -1) {
      existingFollowing.push(uid);
    } else {
      existingFollowing.splice(index, 1);
    }
    const { data, error } = await supabase
      .from("profile")
      .update({ following: existingFollowing })
      .eq("uid", toggleUID)
      .select();

    if (data) {
      console.log(data);
    } else {
      console.log(error);
    }
  };

  const getDetail = async () => {
    const { data, error } = await supabase
      .from("profile")
      .select("uid,name,following,followers,bio,verified")
      .eq("uid", uid);
    if (data) {
      console.log(data);
      setDetails(data[0]);
      if (data?.length !== 0) {
        setCheck(true);
      } else {
        setCheck(false);
      }
    } else {
      console.log(error);
    }
  };
  useEffect(() => {
    getImages();
    getDetail();
  }, [uid]);
  const uRL =
    "https://ldgnpdudaohjifgktmst.supabase.co/storage/v1/object/public/profileImg/";
  const getImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("profileImg")
        .list(`${uid}/`, {
          limit: 10,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setImages(data);
        console.log("Data:", data);
      }
    } catch (e) {
      console.error("An error occurred:", e);
    }
  };

  const handleUpload = async () => {
    const { data, error } = await supabase.storage
      .from("profileImg")
      .upload(`${uid}/${uuidv4()}`, upload);
    if (error) {
      console.error("Error uploading image:", error);
    } else {
      console.log("Image uploaded successfully:", data);
      getImages();
    }
    handleClose();
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };

      reader.readAsDataURL(selectedFile);
    }
    setUpload(selectedFile);
    console.log(selectedFile);
  };
  return (
    <Box
      sx={{
        width: "100%",
        paddingInline: "10px",
        height: "auto",
        backgroundColor: "background.default",
      }}
    >
      {check === true ? (
        <Box className="profile-session">
          <Box
            sx={{
              height: { xs: "130px", md: "180px" },
              width: "100%",
            }}
          >
            <img
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
              src={Image}
              alt="Cover pic"
            />
          </Box>
          <Box
            sx={{
              paddingLeft: { xs: "0px", sm: "20px" },
              marginTop: { xs: "-10px", md: "-50px" },
              display: "flex",
            }}
          >
            <Avatar
              sx={{
                height: { xs: "80px", md: "120px" },
                width: { xs: "80px", md: "120px" },
                border: "3px solid black",
              }}
              src={images && images.length > 0 && images[0]?.name ? `${uRL + uid}/${images[0]?.name}` : auth.currentUser.photoURL
              }
            />
            {auth.currentUser?.uid === uid ? (
              <AddPhotoAlternateIcon
                onClick={uploadBtn}
                sx={{
                  color: "skyblue",
                  zIndex: 99,
                  marginLeft: { xs: "-20px", md: "-30px" },
                }}
              />
            ) : null}
            <Box
              sx={{
                alignSelf: "end",
                marginLeft: "10px",
                paddingTop: { xs: "20px", md: "60px" },
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Typography
                  variant="h5"
                  sx={{ fontSize: { xs: "16px", sm: "20px" } }}
                >
                  {details?.name}
                </Typography>
                {details?.verified === true ? (
                  <VerifiedIcon
                    sx={{
                      color: "primary.main",
                      height: { xs: "16px", sm: "22px" },
                    }}
                  />
                ) : null}
              </Box>
              <Box sx={{ display: "flex", gap: { xs: "0px", sm: "10px" } }}>
                <Button
                  onClick={() => {
                    setBannerOpen(true);
                    setTab(1);
                  }}
                >
                  <Typography
                    variant="subtitle"
                    sx={{ fontSize: { xs: "10px", sm: "14px" } }}
                  >
                    {details?.followers?.length} Followers
                  </Typography>
                </Button>
                <Button
                  onClick={() => {
                    setBannerOpen(true);
                    setTab(2);
                  }}
                >
                  <Typography
                    variant="subtitle"
                    sx={{ fontSize: { xs: "10px", sm: "14px" } }}
                  >
                    {details?.following?.length} Followings
                  </Typography>
                </Button>
                <Dialog open={bannerOpen} onClose={closeBanner}>
                  <Box sx={{ padding: "20px" }}>
                    <DialogTitle>Followers / Followings</DialogTitle>
                    <DialogContent>
                      <TabBanner
                        tab={tab}
                        onClose={closeBanner}
                        following={details?.following}
                        followers={details?.followers}
                      />
                    </DialogContent>
                  </Box>
                </Dialog>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {uid !=="FAVR3QIUj1frkTJiVC1oIdcJljA3" && auth.currentUser?.uid !== uid ? (
                  <Button
                    sx={{
                      height: { xs: "18px", sm: "26px" },
                      fontSize: { xs: "10px", sm: "14px" },
                    }}
                    variant="contained"
                    onClick={() => {
                      toggleFollow(auth.currentUser?.uid);
                      handleFollowing(auth.currentUser?.uid);
                    }}
                  >
                    {details?.followers?.includes(auth.currentUser?.uid)
                      ? "following"
                      : "follow"}
                  </Button>
                ) : null}
              </Box>
            </Box>
            <Dialog open={open} onClose={handleClose}>
              <Box sx={{ padding: "30px" }}>
                <DialogTitle>Upload New Profile Picture</DialogTitle>
                {/* <CropTool/> */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="Selected"
                      style={{ maxWidth: "300px", maxHeight: "200px" }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <Button onClick={handleIconClick} variant="outlined">
                    Choose File
                  </Button>
                  <Button onClick={handleUpload} variant="contained">
                    Upload
                  </Button>
                </Box>
              </Box>
            </Dialog>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </Box>
          <Box
            className="profile-pannel"
            sx={{
              padding: "10px",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "500px",
                md: "1fr 2fr",
              },
              justifyContent: "center",
            }}
          >
            <Box
              className="About-pannel"
              sx={{
                width: "100%",
                // border: "1px solid white",
                minHeight: "auto",
                padding: { xs: "0px", md: "20px" },
              }}
            >
              <Box
              className="Intro-pannel"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  border: "1px solid white",
                  padding: "10px",
                  position: { xs: "relative", md: "sticky" },
                  top: { xs: "0px", md: "70px" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    marginBottom: "10px",
                    alignSelf: "start",
                  }}
                >
                  <Typography variant="h6">Intro</Typography>
                  <Button
                    sx={{minWidth: "auto", color: "white" }}
                    onClick={()=>{alert("This feature will be added soon!")}}
                  >
                    <EditIcon />
                  </Button>
                </Box>
                <Box className="bio">
                  <Typography variant="subtitle">{details?.bio}</Typography>
                </Box>
                <Box sx={{p:2}}>
                  <Typography variant="subtitle">
                    <Chip
                      variant="outlined"
                      icon={<TagIcon />}
                      label="New User"
                    />
                  </Typography>
                </Box>
                      <Box  sx={{
                    display: "flex",
                    marginBottom: "10px",
                    alignSelf: "start",
                  }}>
                      <Typography variant="h6" > Picture's of {details?.name.split(" ")[0]}</Typography>
                </Box>
                <Box sx={{display:"grid",gridTemplateColumns:`${images.length>1?"1fr 1fr":"30vw"}`,gap:"10px"}}>
                {images && images.length > 0 && images.map((e,i)=>
               i<2? <Box key={e.name} sx={{width:{xs:"40vw",sm:"100%",md:"12vw",lg:"15vw"},height:{xs:"40vw",sm:"30vw",md:"12vw",lg:"15vw"}}}>
                  <img src={`${uRL + uid}/${e?.name}`} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="All Profile Pictures" />
                </Box>:null
                )}
                {imageShow && images && images.length > 0 && images.map((e,i)=>
               i>2? <Box key={e.name} sx={{width:{xs:"40vw",sm:"100%",md:"12vw",lg:"15vw"},height:{xs:"40vw",sm:"30vw",md:"12vw",lg:"15vw"}}}>
                  <img src={`${uRL + uid}/${e?.name}`} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="All Profile Pictures" />
                </Box>:null
                )}
                </Box>
                {images.length>2?<Button onClick={()=>{setImageShow(!imageShow)}} sx={{p:0,minWidth:"auto",color:"white",alignSelf:"start"}} disableRipple>See more{" >"}</Button>:null}
              </Box>
            </Box>
            <Box
              className="profile-contents"
              sx={{
                display: "grid",
                padding: { xs: "0px", md: "20px 20px 20px 0px" },
                width: "100%",
                gap: "10px",
              }}
            >
              <Box className="profile-posts" sx={{}}>
                <Post path="profile" id={uid} />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : check === false ? (
        <Box sx={{ height: "94vh", display: "grid", placeItems: "center" }}>
          <h2>No Such Users!!</h2>
        </Box>
      ) : (
        <Stack spacing={1}height="100%">
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton  variant="rectangular"  height={90} />
      {/* For other variants, adjust the size with `width` and `height` */}
      <Skeleton   variant="circular" sx={{height: { xs: "80px", md: "120px" },width: { xs: "80px", md: "120px" }}} />
      <Skeleton  variant="rectangular" sx={{height:"80px" }} />
      <Box sx={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"10px"}}>
      <Skeleton  variant="rounded" height="50vh" />
      <Skeleton  variant="rounded" height="50vh" />
      </Box>
    </Stack>
      )}
    </Box>
  );
}
