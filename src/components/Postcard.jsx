import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Banner from "./profile/Banner";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { auth, db } from "../tools/Firebase";
import Comment from "./Comment";
export default function Postcard({ data, docId, onUpdate }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [react, setReact] = useState(false);
  const [comment, setComment] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState(0);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [caption, setCaption] = useState(data.caption || "");
  const [textArea1, setTextArea1] = useState(data.textArea1 || "");
  const [textArea2, setTextArea2] = useState(data.textArea2 || "");
  const [datas, setDatas] = useState("");
  const openAnchor = Boolean(anchorEl);

  const updateCommentsInFirestore = async (comments) => {
    try {
      const postRef = doc(db, 'posts', docId);
      await updateDoc(postRef, { comments });
    } catch (error) {
      console.error('Error updating comments in Firestore:', error);
    }
  };
  const handleAddComment = async (newComment) => {
    try {
      const updatedComments = [...data.comments, { uid: auth.currentUser?.uid, comment: newComment }];
      setDatas({ ...data, comments: updatedComments });
      await updateCommentsInFirestore(updatedComments);
    } catch (error) {
      console.error('Error in handleAddComment:', error);
    }
  };
  const handleSubmitComment=async()=>{
    if(message.trim()!==''){
   await handleAddComment(message);
   onUpdate()
   setMessage("");
  }
  }

  const handleComment = () => {
    setComment(true);
  };
  const closeComment=()=>{
    setComment(false)
  }
  const handleReact = (num) => {
    setReact(true);
    setTab(num);
  };
  const closeReact = () => {
    setReact(false);
  };
  // Function to handle voting
  const handleVote = async (fieldName, otherFieldName) => {
    try {
      const hasVotedForField = data[otherFieldName].includes(
        auth.currentUser?.uid
      );
      const shouldUnvote = data[fieldName].includes(auth.currentUser?.uid);
      const postRef = doc(db, "posts", docId);

      if (hasVotedForField) {
        // Unvote for the other field before voting
        await updateDoc(
          postRef,
          otherFieldName,
          data[otherFieldName].filter(
            (userId) => userId !== auth.currentUser?.uid
          )
        );
      }

      if (shouldUnvote) {
        // Unvote if already voted
        await updateDoc(
          postRef,
          fieldName,
          data[fieldName].filter((userId) => userId !== auth.currentUser?.uid)
        );
      } else {
        // Vote if not voted
        await updateDoc(postRef, fieldName, [
          ...data[fieldName],
          auth.currentUser?.uid,
        ]);
      }

      onUpdate();
    } catch (error) {
      console.error("Error in handleVote:", error);
    }
  };

  // Usage
  const handleVote1 = () => {
    handleVote("vote1", "vote2");
  };

  const handleVote2 = () => {
    handleVote("vote2", "vote1");
  };

  const handleClick1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setCaption(data.caption || "");
    setTextArea1(data.textArea1 || "");
    setTextArea2(data.textArea2 || "");
    setOpen1(false);
  };
  const handleUpdate = async () => {
    const postRef = doc(db, "posts", docId);
    if (caption.length > 0 && data.caption === caption) {
      try {
        await updateDoc(postRef, { caption });
        handleClose1();
        onUpdate();
      } catch (error) {
        console.error("Error updating post: ", error);
      }
    } else {
      alert("Error!!:You're trying to update same text or Empty box");
    }
  };
  const handleUpdateText = async () => {
    const postRef = doc(db, "posts", docId);
    if (
      (caption.length > 0 &&
        textArea1.length > 0 &&
        textArea2.length > 0 &&
        data.caption !== caption) ||
      data.textArea1 !== textArea1 ||
      data.textArea2 !== textArea2
    ) {
      try {
        await updateDoc(postRef, { caption, textArea1, textArea2 });
        handleClose1();
        onUpdate();
      } catch (error) {
        console.error("Error updating post: ", error);
      }
    } else {
      alert("Error!!:You're trying to update same text or Empty box");
    }
  };
  const handleClick2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleDelete = async () => {
    const postDocRef = doc(db, "posts", docId);
    try {
      await deleteDoc(postDocRef);
      onUpdate();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleanchorClose = () => {
    setAnchorEl(null);
  };
  if (data.image1 && data.image2) {
    return (
      <Paper
        sx={{
          minHeight: "auto",
          padding: "10px",
          display: "flex",
          border: "1px solid black",
          flexDirection: "column",
          borderRadius: "10px",
        }}
      >
        <Box sx={{ height: "40px", display: "flex" }}>
          <Banner info={data.userID} />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row-reverse" },
            }}
          >
            {data.userID === auth.currentUser?.uid ? (
              <Button
                sx={{
                  padding: "0px",
                  "&:hover": { bgcolor: "transparent" },
                  "&:focus": { outline: "none" },
                }}
                aria-controls={openAnchor ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openAnchor ? "true" : undefined}
                onClick={handleClick}
                disableRipple
              >
                <MoreVertIcon
                  sx={{ fontSize: { xs: "18px", sm: "20px" }, color: "white" }}
                />
              </Button>
            ) : null}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openAnchor}
              onClose={handleanchorClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem sx={{ py: "0px", px: "8px" }} onClick={handleClick1}>
                <EditIcon sx={{ fontSize: { xs: "18px", sm: "20px" } }} />
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: { xs: "13px", sm: "15px" } }}
                >
                  Edit
                </Typography>
              </MenuItem>
              <MenuItem
                sx={{ py: { xs: "0px", sm: "8px" }, px: "8px" }}
                onClick={handleClick2}
              >
                <DeleteIcon sx={{ fontSize: { xs: "18px", sm: "20px" } }} />
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: { xs: "13px", sm: "15px" } }}
                >
                  Delete
                </Typography>
              </MenuItem>
            </Menu>
            <Dialog open={open1} onClose={handleClose1}>
              <DialogTitle>Post Update</DialogTitle>
              <DialogContent>
                <textarea
                  style={{
                    width: "100%",
                    resize: "none",
                    outline: "none",
                    paddingInline: "10px",
                    borderRadius: "5px",
                    border: "none",
                    height: "60px",
                    fontSize: "16px",
                  }}
                  type="text"
                  placeholder="Caption.."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={200}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleUpdate}>Update</Button>
                <Button onClick={handleClose1}>Cancel</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={open2} onClose={handleClose2}>
              <DialogTitle>Are You Sure?</DialogTitle>
              <DialogContent>Do you wanna delete this post ?</DialogContent>
              <DialogActions>
                <Button onClick={handleDelete}>Delete</Button>
                <Button onClick={handleClose2}>Cancle</Button>
              </DialogActions>
            </Dialog>
            <Typography
              variant="subtitle"
              sx={{ fontSize: { xs: "13px", sm: "18px" } }}
            >
              {new Date(data.timestamp.seconds * 1000).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ height: "auto", padding: "10px" }}>{data.caption}</Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: { xs: "40vw", sm: "25vw", lg: "20vw" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={data.image1}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              alt="image of post"
            />
          </Box>
          <Typography variant="h5" sx={{ textAlign: "center", marginX: 1 }}>
            OR
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <img
              src={data.image2}
              style={{
                height: "100%", // Set height to 100%
                width: "100%",
                objectFit: "cover",
              }}
              alt="image of post"
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            marginTop: "5px",
            height: "50px",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "5px",
              alignItems: "baseline",
              padding: "0px",
            }}
          >
            <Button
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                p: "0px",
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
                "&:focus": { outline: "none" },
                minWidth: "auto",
                color: "white",
              }}
              disableRipple
              onClick={() => {
                handleReact(1);
              }}
            >
              {data.vote1.includes(auth.currentUser?.uid) ||
              data.vote2.includes(auth.currentUser?.uid)
                ? data.vote1.length
                : null}
            </Button>
            <Button
              sx={{
                height: { xs: "25px", sm: "30px" },
                minWidth: { xs: "25px", sm: "30px" },
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                border: "1px solid white",
                padding: "0px",
                "&:hover": { bgcolor: "transparent" },
                "&:focus": { outline: "none" },
                color: "white",
                background: `${
                  data.vote1.includes(auth.currentUser?.uid)
                    ? "linear-gradient(90deg, rgba(0,213,255,0.5) 0%, rgba(108,9,121,0.5) 100%)"
                    : "none"
                }`,
              }}
              disableRipple
              onClick={handleVote1}
            >
              <Typography
                sx={{
                  fontFamily: "Graduate",
                  fontSize: { xs: "16px", sm: "20px" },
                }}
              >
                V
              </Typography>
            </Button>
          </Box>
          <Button
            sx={{
              display: "flex",
              gap: "5px",
              color: "white",
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
              "&:focus": { outline: "none" },
              p: 0,
            }}
            disableRipple
            onClick={handleComment}
          >
            <Typography>{data?.comments.length}</Typography>
            <ModeCommentIcon sx={{ xs: "18px", sm: "22px" }} />
          </Button>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: "5px",
              padding: "0px",
            }}
          >
            <Button
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                p: "0px",
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
                "&:focus": { outline: "none" },
                minWidth: "auto",
                color: "white",
              }}
              disableRipple
              onClick={() => {
                handleReact(2);
              }}
            >
              {data.vote1.includes(auth.currentUser?.uid) ||
              data.vote2.includes(auth.currentUser?.uid)
                ? data.vote2.length
                : null}
            </Button>
            <Button
              sx={{
                height: { xs: "25px", sm: "30px" },
                minWidth: { xs: "25px", sm: "30px" },
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                border: "1px solid white",
                padding: "0px",
                "&:hover": { bgcolor: "transparent" },
                "&:focus": { outline: "none" },
                color: "white",
                background: `${
                  data.vote2.includes(auth.currentUser?.uid)
                    ? "linear-gradient(90deg, rgba(0,213,255,0.5) 0%, rgba(108,9,121,0.5) 100%)"
                    : "none"
                }`,
              }}
              disableRipple
              onClick={handleVote2}
            >
              <Typography
                sx={{
                  fontFamily: "Graduate",
                  fontSize: { xs: "16px", sm: "20px" },
                }}
              >
                V
              </Typography>
            </Button>
          </Box>
        </Box>
       <Dialog open={comment} onClose={closeComment}>
        <DialogTitle sx={{textAlign:"center"}}>Comment</DialogTitle>
        <DialogContent sx={{height:"60vh",display:"flex",flexDirection:"Column",minWidth:{xs:"80vw",sm:"65vw",md:"40vw",lg:"30vw"},padding:{xs:"0px"}}}>
        <Box sx={{flexGrow:1,overflow:"auto"}}>
            {data.comments.map((comment, index) => (
          <Box key={index} sx={{m:1}}>
            <Comment comments={comment} index={index} id={docId}  reload={onUpdate}/>
          </Box>
        ))}
          </Box>
          <Box sx={{height:"50px",display:"grid",placeItems:"center",px:2,gridTemplateColumns:"4fr 1fr"}}>
          <input
                type="text"
                placeholder="Comment..."
                value={message}
                onChange={(e)=>{setMessage(e.target.value)}}
                style={{
                  paddingInline: "15px",
                  height: "30px",
                  outline: "none",
                  border: "none",
                  width:"100%",
                  borderRadius: "50px",
                  fontSize: "13px",
                }}
                maxLength={200}
              />
            <Button sx={{marginLeft:"5px",height:"30px","&:hover":{bgcolor:"transparent"},"&:focus":{outline:"none"},color:"white"}} variant="contained" onClick={handleSubmitComment}>Send</Button>
          </Box>
        </DialogContent>
       </Dialog>    
        <Dialog open={react} onClose={closeReact}>
          <DialogTitle>{tab === 2 ? "Right Image Vote" : `Left Image Vote`}</DialogTitle>
          <DialogContent sx={{ maxWidth: "300px", minWidth: "200px" }}>
            <Box>
              {tab === 2
                ? data.vote2.map((e, i) => {
                    return (
                      <Box key={i} sx={{ my: 1 }}>
                        <Banner info={e} />
                      </Box>
                    );
                  })
                : data.vote1.map((e, i) => {
                    return (
                      <Box key={i} sx={{ my: 1 }}>
                        <Banner info={e} />
                      </Box>
                    );
                  })}
            </Box>
          </DialogContent>
        </Dialog>
      </Paper>
    );
  } else {
    return (
      <Paper
        sx={{
          minHeight: "auto",
          padding: "10px",
          display: "flex",
          border: "1px solid black",
          flexDirection: "column",
          borderRadius: "4px",
        }}
      >
        <Box sx={{ height: "40px", display: "flex" }}>
          <Banner info={data.userID} />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row-reverse" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {data.userID === auth.currentUser?.uid ? (
              <Button
                sx={{
                  padding: "0px",
                  "&:hover": { bgcolor: "transparent" },
                  "&:focus": { outline: "none" },
                }}
                aria-controls={openAnchor ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openAnchor ? "true" : undefined}
                onClick={handleClick}
                disableRipple
              >
                <MoreVertIcon
                  sx={{ fontSize: { xs: "18px", sm: "20px" }, color: "white" }}
                />
              </Button>
            ) : null}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openAnchor}
              onClose={handleanchorClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem sx={{ py: "0px", px: "8px" }} onClick={handleClick1}>
                <EditIcon sx={{ fontSize: { xs: "18px", sm: "20px" } }} />
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: { xs: "13px", sm: "15px" } }}
                >
                  Edit
                </Typography>
              </MenuItem>
              <MenuItem
                sx={{ py: { xs: "0px", sm: "8px" }, px: "8px" }}
                onClick={handleClick2}
              >
                <DeleteIcon sx={{ fontSize: { xs: "18px", sm: "20px" } }} />
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: { xs: "13px", sm: "15px" } }}
                >
                  Delete
                </Typography>
              </MenuItem>
            </Menu>
            <Dialog open={open1} onClose={handleClose1}>
              <DialogTitle>Post Update</DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    display: { xs: "grid", sm: "grid" },
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: "5px",
                  }}
                >
                  <Box sx={{ gridColumn: { sm: "1/3" } }}>
                    <textarea
                      style={{
                        width: "100%",
                        resize: "none",
                        outline: "none",
                        paddingInline: "10px",
                        borderRadius: "5px",
                        border: "none",
                        height: "60px",
                        fontSize: "16px",
                      }}
                      type="text"
                      placeholder="Caption.."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      maxLength={200}
                    />
                  </Box>
                  <input
                    style={{
                      outline: "none",
                      paddingInline: "10px",
                      borderRadius: "5px",
                      border: "none",
                      height: "32px",
                      fontSize: "16px",
                    }}
                    type="text"
                    placeholder="TextArea1.."
                    value={textArea1}
                    onChange={(e) => {
                      setTextArea1(e.target.value);
                    }}
                    maxLength={50}
                  />
                  <input
                    style={{
                      outline: "none",
                      paddingInline: "10px",
                      borderRadius: "5px",
                      border: "none",
                      height: "32px",
                      fontSize: "16px",
                    }}
                    type="text"
                    placeholder="TextArea2.."
                    value={textArea2}
                    onChange={(e) => {
                      setTextArea2(e.target.value);
                    }}
                    maxLength={50}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleUpdateText}>Update</Button>
                <Button onClick={handleClose1}>Cancel</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={open2} onClose={handleClose2}>
              <DialogTitle>Are You Sure?</DialogTitle>
              <DialogContent>Do you wanna delete this post ?</DialogContent>
              <DialogActions>
                <Button onClick={handleDelete}>Delete</Button>
                <Button onClick={handleClose2}>Cancle</Button>
              </DialogActions>
            </Dialog>
            <Typography
              variant="subtitle"
              sx={{ fontSize: { xs: "13px", sm: "18px" } }}
            >
              {new Date(data.timestamp.seconds * 1000).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ height: "auto", padding: "10px" }}>{data.caption}</Box>
        <Box
          sx={{
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(90deg, rgba(0,213,255,0.1) 0%, rgba(108,9,121,0.1) 100%)",
            borderRadius: "4px",
          }}
        >
          <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: "18px", sm: "20px" } }}
            >
              {data.textArea1}
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", fontSize: { xs: "16px", sm: "18px" } }}
          >
            {" "}
            OR{" "}
          </Typography>
          <Box sx={{ flex: 1, display: "grid", placeItems: "center" }}>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: "18px", sm: "20px" } }}
            >
              {data.textArea2}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            height: "50px",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: "5px",
              padding: "0px",
            }}
          >
            <Button
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                p: "0px",
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
                "&:focus": { outline: "none" },
                minWidth: "auto",
                color: "white",
              }}
              disableRipple
              onClick={() => {
                handleReact(1);
              }}
            >
              {data.vote1.includes(auth.currentUser?.uid) ||
              data.vote2.includes(auth.currentUser?.uid)
                ? data.vote1.length
                : null}
            </Button>
            <Button
              sx={{
                height: { xs: "25px", sm: "30px" },
                minWidth: { xs: "25px", sm: "30px" },
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                border: "1px solid white",
                padding: "0px",
                "&:hover": { bgcolor: "transparent" },
                "&:focus": { outline: "none" },
                color: "white",
                background: `${
                  data.vote1.includes(auth.currentUser?.uid)
                    ? "linear-gradient(90deg, rgba(0,213,255,0.5) 0%, rgba(108,9,121,0.5) 100%)"
                    : "none"
                }`,
              }}
              disableRipple
              onClick={handleVote1}
            >
              <Typography
                sx={{
                  fontFamily: "Graduate",
                  fontSize: { xs: "16px", sm: "20px" },
                }}
              >
                V
              </Typography>
            </Button>
          </Box>
          <Button
            sx={{
              display: "flex",
              gap: "5px",
              color: "white",
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
              "&:focus": { outline: "none" },
              p: 0,
            }}
            disableRipple
            onClick={handleComment}
          >
            <Typography>{data?.comments.length}</Typography>
            <ModeCommentIcon sx={{ xs: "18px", sm: "22px" }} />
          </Button>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: "5px",
              padding: "Button0px",
            }}
          >
            <Button
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                p: "0px",
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
                "&:focus": { outline: "none" },
                minWidth: "auto",
                color: "white",
              }}
              disableRipple
              onClick={() => {
                handleReact(2);
              }}
            >
              {data.vote1.includes(auth.currentUser?.uid) ||
              data.vote2.includes(auth.currentUser?.uid)
                ? data.vote2.length
                : null}
            </Button>
            <Button
              sx={{
                height: { xs: "25px", sm: "30px" },
                minWidth: { xs: "25px", sm: "30px" },
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                border: "1px solid white",
                padding: "0px",
                "&:hover": { bgcolor: "transparent" },
                "&:focus": { outline: "none" },
                color: "white",
                background: `${
                  data.vote2.includes(auth.currentUser?.uid)
                    ? "linear-gradient(90deg, rgba(0,213,255,0.5) 0%, rgba(108,9,121,0.5) 100%)"
                    : "none"
                }`,
              }}
              disableRipple
              onClick={handleVote2}
            >
              <Typography
                sx={{
                  fontFamily: "Graduate",
                  fontSize: { xs: "16px", sm: "20px" },
                }}
              >
                V
              </Typography>
            </Button>
          </Box>
        </Box>
       <Dialog open={comment} onClose={closeComment}>
        <DialogTitle sx={{textAlign:"center"}}>Comment</DialogTitle>
        <DialogContent sx={{height:"60vh",display:"flex",flexDirection:"Column",minWidth:{xs:"80vw",sm:"65vw",md:"40vw",lg:"30vw"},padding:{xs:"0px"}}}>
          <Box sx={{flexGrow:1,overflow:"auto"}}>
            {data.comments.map((comment, index) => (
          <Box key={index} sx={{m:1}}>
            <Comment comments={comment} index={index} id={docId} reload={onUpdate}/>
          </Box>
        ))}
          </Box>
          <Box sx={{height:"50px",display:"grid",placeItems:"center",px:2,gridTemplateColumns:"4fr 1fr"}}>
          <input
                type="text"
                placeholder="Comment..."
                value={message}
                onChange={(e)=>{setMessage(e.target.value)}}
                style={{
                  paddingInline: "15px",
                  height: "30px",
                  outline: "none",
                  border: "none",
                  width:"100%",
                  borderRadius: "50px",
                  fontSize: "13px",
                }}
                maxLength={200}
              />
            <Button sx={{marginLeft:"5px",height:"30px","&:hover":{bgcolor:"transparent"},"&:focus":{outline:"none"},color:"white"}} variant="contained" onClick={handleSubmitComment}>Send</Button>
          </Box>
        </DialogContent>
       </Dialog>    
        <Dialog open={react} onClose={closeReact}>
          <DialogTitle>{tab === 2 ? `${data.textArea2} Vote` : `${data.textArea1} Vote`}</DialogTitle>
          <DialogContent sx={{ maxWidth: "300px", minWidth: "200px" }}>
            <Box>
              {tab === 2
                ? data.vote2.map((e, i) => {
                    return (
                      <Box key={i} sx={{ my: 1 }}>
                        <Banner info={e} />
                      </Box>
                    );
                  })
                : data.vote1.map((e, i) => {
                    return (
                      <Box key={i} sx={{ my: 1 }}>
                        <Banner info={e} />
                      </Box>
                    );
                  })}
            </Box>
          </DialogContent>
        </Dialog>
      </Paper>
    );
  }
}
