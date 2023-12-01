import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,Dialog,
  Typography,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import PublicIcon from "@mui/icons-material/Public";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Post from "../components/Post";
import { supabase } from "../tools/Supabase";
import { auth } from "../tools/Firebase";
import Banner from "../components/profile/Banner";
import { Context } from "../tools/AuthContext";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Link } from "react-router-dom";
export default function Home() {
  const { path } = useContext(Context);
  const [followings, setFollowings] = useState([]);
  const [feed, setFeed] = useState(2);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (path === 3) {
      handleFollowers();
    }
  }, [path]);
  const handleClose=()=>{
    setOpen(false)
  }
  const handleGlobal=()=>{ 
    setFeed(2)
  }
  const handleFollowing=()=>{
    setFeed(1)
  }
  const handleFollowers=()=>{
    setFeed(3)
    setOpen(true)
  }
  const handleAbout=()=>{
    setFeed(4)
  }
  const getfollowing = async () => {
    const { data, error } = await supabase
      .from("profile")
      .select("following,followers")
      .eq("uid", auth.currentUser?.uid);
    if (data) {
      setFollowings(data);
    } else {
      console.log(error);
    }
  };
  useEffect(() => {
    getfollowing();
  }, []);
  return (
    <Box
      id="Home-Feed"
      sx={{
        height: "auto",
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 2fr",
          md: "1fr 3fr ",
          lg: "1fr 2fr 1fr",
        },
        backgroundColor: "background.default",
      }}
    >
      <Box
        id="profile"
        sx={{
          width: "100%",
          minWidth: "130px",
          height: "86vh",
          alignItems: "center",
          display: { xs: "none", sm: "flex" },
        }}
      >
        <List
          sx={{
            display: "flex",
            width: { md: "170px", lg: "200px" },
            paddingBlock: { sm: "5px", md: "10px", lg: "20px" },
            flexDirection: "column",
            position: "fixed",
            top: "30%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "0px 5px 5px 0px",
          }}
        >
          <ListItem
            sx={{ padding: { xs: "0px", md: "10px" }, py: { sm: "7px" } }}
          >
            <ListItemButton  onClick={handleGlobal} disableRipple>
              {feed===2?<KeyboardArrowRightIcon/>:null}
              <PublicIcon />
              <ListItemText sx={{ paddingLeft: "4px" }}>Global</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem
            sx={{ padding: { xs: "0px", md: "10px" }, py: { sm: "7px" } }}
          >
            <ListItemButton  onClick={handleFollowing} disableRipple>
            {feed===1?<KeyboardArrowRightIcon/>:null}
              <PeopleAltOutlinedIcon />
              <ListItemText sx={{ paddingLeft: "4px" }}>Following</ListItemText>
            </ListItemButton >
          </ListItem>
          <ListItem
            sx={{ padding: { xs: "0px", md: "10px" }, py: { sm: "7px" } }}
          >
            <ListItemButton  onClick={handleFollowers} disableRipple>
            {feed===3?<KeyboardArrowRightIcon/>:null}
              <PersonAddOutlinedIcon />
              <ListItemText sx={{ paddingLeft: "4px" }}>Followers</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem
            sx={{ padding: { xs: "0px", md: "10px" }, py: { sm: "7px" } }}
          >
              <Link to="/support" style={{color:"white"}}>
            <ListItemButton  disableRipple>
            {feed===4?<KeyboardArrowRightIcon/>:null}
              <InfoOutlinedIcon />
              <ListItemText sx={{ paddingLeft: "4px" }}>Support</ListItemText>
            </ListItemButton>
              </Link>
          </ListItem>
        </List>
      </Box>
      <Box
        id="feeds"
        sx={{
          // border: "1px solid red",
          display: "flex",
          flexDirection: "column",
          borderLeft: { xs: "none", sm: "1px solid white" },
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", paddingTop: "10px" }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
          {path === 1 || feed === 1 ? "Following" : path === 2 || feed === 2 ? "Global Feed" : "Followers"}
          </Typography>
        </Box>
        <Post path={path === 1 || feed === 1 ? "following" : path === 2 || feed === 2 ? "feed" : null} id="100" />
      </Box>
      <Box
        id="tags"
        sx={{
          width: "100%",
          display: { xs: "none", lg: "initial" },
          py: "10px",
          paddingLeft: "20px",
          height: "88vh",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            position: "fixed",
            top: { xs: "60px", sm: "70px" },
          }}
        >
          <Box sx={{ height: "50%", width: "100%", overflowY: "auto" }}>
            <Typography
              variant="h6"
              sx={{ fontSize: { sm: "14px", md: "16px" } }}
            >
              Followings
            </Typography>
            <Box>
              {followings?.map((e, i) => (
                <Box key={i}>
                  {e.following.map((userId, j) => (
                    <Box sx={{ py: "5px" }} key={j}>
                      <Banner  info={userId}  />
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ height: "50%", width: "100%", overflowY: "auto" }}>
            <Typography
              variant="h6"
              sx={{ fontSize: { sm: "14px", md: "16px" } }}
            >
              Followers
            </Typography>
            <Box>
              {followings?.map((e, i) => (
                <Box key={i}>
                  {e.followers.length > 0 ? (
                    e.followers.map((userId, j) => (
                      <Box sx={{ py: "5px" }} key={j}>
                        <Banner info={userId}  />
                      </Box>
                    ))
                  ) : (
                    <Box>No Followers</Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
          <Dialog open={open} onClose={handleClose}>
                  <Box sx={{ padding: "20px" }}>
                    <DialogTitle>Followers</DialogTitle>
                    <DialogContent>
                    {followings?.map((e, i) => (
                <Box key={i}>
                  {e.followers.length > 0 ? (
                    e.followers.map((userId, j) => (
                      <Box sx={{ py: "5px" }} key={j}>
                        <Banner info={userId} />
                      </Box>
                    ))
                  ) : (
                    <Box>No Followers</Box>
                  )}
                </Box>
              ))}
                    </DialogContent>
                  </Box>
                </Dialog>
        </Box>
      </Box>
    </Box>
  );
}
