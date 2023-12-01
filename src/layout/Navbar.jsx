import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Avatarcmp from "../components/Avatarcmp";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { auth, db, signout } from "../tools/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { v4 as uuidv4 } from "uuid";
import VoteHubLogo from "../image/VoteHublogo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext } from "react";
import { Context } from "../tools/AuthContext";
import { supabase } from "../tools/Supabase";
import Banner from "../components/profile/Banner";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [details, setDetails] = useState([]);
  const fileInputRef = useRef(null);
  const [search, setSearch] = useState("");
  const imageInputRef = useRef(null);
  const searchInput = search.trim().replace(/\s+/g, " ");

  const getDetail = async (input) => {
    try {
      const { data, error } = await supabase
        .from("profile")
        .select("uid, name")
        .ilike("name", `%${input.split("").join("%")}%`);

      if (error) {
        console.error("Error fetching data:", error);
        return null; // Return null or handle the error appropriately
      } else {
        return data;
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
      return null; // Return null or handle the error appropriately
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchInput.length > 0) {
        setDetails([]);
        const data = await getDetail(searchInput);
        if (data !== null) {
          setDetails(data);
        }
      }
    };

    fetchData();
  }, [searchInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (image1 && image2) {
      await imageUploads();

      setOpen(false);
      setImage1(null);
      setCaption("");
      setImage2(null);
      setTextArea1("");
      setTextArea2("");
    } else if (textArea1.length > 0 && textArea2.length > 0) {
      await firestoreCreate();
      setOpen(false);
      setImage1(null);
      setCaption("");
      setImage2(null);
      setTextArea1("");
      setTextArea2("");
    } else {
      alert("Please fill out all fields");
    }
  };

  const imageUploads = async () => {
    const storage = getStorage();
    const postId = auth.currentUser?.uid;
    const image1Id = uuidv4();
    const image2Id = uuidv4();
    const storageRef1 = ref(storage, `posts/${postId}/${image1Id}`);
    const storageRef2 = ref(storage, `posts/${postId}/${image2Id}`);
    const file1 = image1;
    const file2 = image2;

    if (!(file1 instanceof File) || !(file2 instanceof File)) {
      console.error("Invalid file objects.", error);
      return;
    }

    try {
      const contentType1 = file1.type || "image/jpeg";
      const contentType2 = file2.type || "image/jpeg";

      const metadata1 = { contentType: contentType1 };
      const metadata2 = { contentType: contentType2 };

      const snapshots = await Promise.all([
        uploadBytes(storageRef1, file1, metadata1),
        uploadBytes(storageRef2, file2, metadata2),
      ]);

      const downloadURL1 = await getDownloadURL(snapshots[0].ref);
      const downloadURL2 = await getDownloadURL(snapshots[1].ref);
      await firestoreCreate(downloadURL1, downloadURL2);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  const { user } = useContext(Context);
  const firestoreCreate = async (url1, url2) => {
    const postsCollection = collection(db, "posts");

    try {
      const docRef = await addDoc(postsCollection, {
        userID: auth.currentUser?.uid,
        caption: caption,
        textArea1: textArea1,
        textArea2: textArea2,
        image1: url1 || null,
        image2: url2 || null,
        vote1: [],
        vote2: [],
        comments: [],
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const IconClick = () => {
    imageInputRef.current.click();
  };

  const [caption, setCaption] = useState("");
  const [textArea1, setTextArea1] = useState("");
  const [textArea2, setTextArea2] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage1(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage2(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage2(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAnchor = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleanchorClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    handleanchorClose();
    signout();
  };

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === "2") {
      setTextArea1("");
      setTextArea2("");
    }
    if (newValue === "1") {
      setImage1(null);
      setSelectedImage(null);
      setSelectedImage2(null);
      setImage2(null);
    }
  };
  const handleUpload = () => {
    setOpen(true);
    handleanchorClose();
  };

  return (
    <Box
      component="nav"
      sx={{
        height: { xs: "60px", sm: "70px" },
        width: "100%",
        backgroundColor: `${useLocation().pathname==="/home"?"transparent":"background.paper"}`,
        backgroundImage: `${useLocation().pathname==="/home"?"linear-gradient(90deg, rgba(0,213,255,0.5) 0%, rgba(108,9,121,0.5) 100%)":"background.paper"}`,
        position: `${useLocation().pathname==="/home"?"relative":"sticky"}`,
        top: 0,
        zIndex: 999,
      }}
    >
      <List
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingInline: { xs: "4vw", sm: "50px", md: "90px" },
          gap: "10px",
          alignItems: "center",
          paddingBlock: "0px",
          width: "100%",
        }}
      >
        <Box>
          <ListItem sx={{ paddingInline: "0px" }}>
            <Link to="/">
              <Avatar
                sx={{ height: "50px", width: "50px" }}
                src={VoteHubLogo}
              />
            </Link>
          </ListItem>
        </Box>
        <Box sx={{ flexGrow: 1, justifySelf: "flex-start" }}>
          {user ? (
            <Box
              sx={{
                height: "30px",
                maxWidth: { xs: "250px", sm: "300px" },
                minWidth: { xs: "70px" },
                position: "relative",
              }}
            >
              <input
        type="search"
        placeholder="Search..."
        style={{
          paddingInline: "15px",
          height: "100%",
          outline: "none",
          width: "100%",
          border: "none",
          borderRadius: "50px",
          fontSize: "16px",
        }}
        onChange={(e) => setSearch(e.target.value)}
        onClick={() => setShow(true)}
        onBlur={() => setShow(false)}
        value={search}
      />
      {show && details.length > 0 ? (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            width: { xs: "200px", sm: "100%" },
            left: 0,
            px: 2,
            py: 1,
            bgcolor: "background.paper",
            color: "text.primary",
            borderRadius: "5px",
          }}
        >
          {details.map((e, i) => (
            <Box
              key={i}
              sx={{ py: { xs: "5px", sm: "8px" } }}
              onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from triggering before onClick
            >
              <Banner info={e.uid} />
            </Box>
          ))}
        </Box>
              ) : (
                show && ( // Only show if the user has clicked
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      width: { xs: "200px", sm: "100%" },
                      left: 0,
                      px: 2,
                      py: 1,
                      bgcolor: "background.paper",
                      color: "text.primary",
                      borderRadius: "5px",
                      fontStyle: "italic",
                    }}
                  >
                    {details.length === 0 && "No results found"}
                  </Box>
                )
              )}
            </Box>
          ) : null}
        </Box>
        {user ? (
          <Box sx={{ display: "flex" }}>
            <Avatarcmp uid={auth.currentUser?.uid} />
            <Button
              sx={{
                padding: "0px",
                outline: "none",
                border: "none",
                "&:focus": { outline: "none" },
                "&:hover": { backgroundColor: "transparent" },
              }}
              // id="basic-button"
              aria-controls={openAnchor ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openAnchor ? "true" : undefined}
              onClick={handleClick}
              disableRipple
            >
              <ExpandMoreIcon sx={{ color: "white" }} />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openAnchor}
              onClose={handleanchorClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleanchorClose}><Link to={auth.currentUser?.uid} style={{color:"white"}}>Profile</Link></MenuItem>
              <MenuItem onClick={handleUpload}>Upload</MenuItem>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </Box>
        ) : (
          <>
          <Button disableRipple>
            <Link to="/login" style={{color:"white",textDecoration:"underline"}}>Log In</Link>
          </Button>
          <Button disableRipple>
            <Link to="/signin" style={{color:"white",textDecoration:"underline"}}>Sign In</Link>
          </Button>
          </>
        )}
        <Dialog open={open} onClose={handleClose} sx={{ color:"white",}}>
          <DialogTitle sx={{ textAlign: "center", fontSize: "22px" }}>
            Post
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ paddingBlock: "0px" }}>
              <textarea
                type="text"
                placeholder="CAPTION.."
                style={{
                  resize: "none",
                  padding: "10px",
                  background: "transparent",
                  outline: "none",
                  width: "100%",
                  color:"white",
                  height: "100px",
                  fontSize: "20px",
                  fontWeight: "light",
                  border: "none",
                }}
                required
                value={caption}
                maxLength={200}
                onChange={(e) => setCaption(e.target.value)}
              />
              <Box sx={{ width: "100%",color:"white" }}>
                <TabContext value={value} >
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Text" sx={{color:"white"}}value="1" />
                      <Tab label="Image" sx={{color:"white"}}value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        width: "400px",
                        alignItems: "center",
                      }}
                    >
                      <textarea
                        type="text"
                        style={{
                          resize: "none",
                          background: "transparent",
                          outline: "1px solid black",
                          height: "60px",
                          width: "100%",
                          color:"white",
                          fontSize: "18px",
                          fontWeight: "light",
                          border: "none",
                        }}
                        value={textArea1}
                        maxLength={50}
                        onChange={(e) => setTextArea1(e.target.value)}
                      />
                      <Typography variant="h5"> OR </Typography>
                      <textarea
                        type="text"
                        style={{
                          resize: "none",
                          background: "transparent",
                          outline: "1px solid black",
                          height: "60px",
                          width: "100%",
                          color:"white",
                          fontSize: "18px",
                          fontWeight: "light",
                          border: "none",
                        }}
                        maxLength={50}
                        value={textArea2}
                        onChange={(e) => setTextArea2(e.target.value)}
                      />
                    </Box>
                  </TabPanel>
                  <TabPanel value="2">
                    <Box
                      sx={{
                        width: "400px",
                        justifyContent: "center",
                        maxHeight: "300px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <AddPhotoAlternateIcon onClick={IconClick} />
                        <Button
                          sx={{
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <input
                            type="file"
                            ref={imageInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          {selectedImage && (
                            <img
                              src={selectedImage}
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                              }}
                              alt="Selected"
                            />
                          )}
                        </Button>
                      </Box>
                      <Typography variant="h5"> OR </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <AddPhotoAlternateIcon onClick={handleIconClick} />
                        <Button
                          sx={{
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          {selectedImage2 && (
                            <img
                              src={selectedImage2}
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                              }}
                              alt="Selected"
                            />
                          )}
                        </Button>
                      </Box>
                    </Box>
                  </TabPanel>
                </TabContext>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" type="submit">
                Post
              </Button>
              <Button variant="filled" onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </List>
    </Box>
  );
}
