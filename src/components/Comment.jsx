import React, { useState } from 'react'
import Banner from './profile/Banner'
import { Box, Button, Menu, MenuItem, Paper, Typography } from '@mui/material'
import { auth, db } from '../tools/Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function Comment({comments,index,id,reload}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openAnchor = Boolean(anchorEl);


  const deleteCommentInFirestore = async (postId, updatedComments) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { comments: updatedComments });
    } catch (error) {
      console.error('Error deleting comment in Firestore:', error);
    }
  };
  
  const handleDeleteComment = async (postId, commentIndex) => {
    try {
      // Fetch the existing comments from Firestore
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
  
      if (postDoc.exists()) {
        const existingComments = postDoc.data().comments || [];
  
        // Create a copy of the existing comments array and remove the comment at the specified index
        const updatedComments = [...existingComments];
        updatedComments.splice(commentIndex, 1);
  
        // Update Firestore with the new comments (deleted comment is now removed)
        await deleteCommentInFirestore(postId, updatedComments);
        reload()
      } else {
        console.error('Post does not exist.');
      }
    } catch (error) {
      console.error('Error in handleDeleteComment:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleanchorClose = () => {
    setAnchorEl(null);
  };
  return (
    <Paper sx={{bgcolor:"background.default",p:1}}>
        {/* {index+1} */}
      <Box sx={{display:"flex"}}>
      <Banner info={comments.uid}/>
      {comments.uid === auth.currentUser?.uid ? (
              <Button
                sx={{
                  padding: "0px",
                  "&:hover": { bgcolor: "transparent" },
                  "&:focus": { outline: "none" },minWidth:"auto"
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
              <MenuItem
                sx={{ py: { xs: "0px", sm: "8px" }, px: "8px" }}
                onClick={() => handleDeleteComment(id, index)}
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
      </Box>
      <hr />
      <Box sx={{marginTop:"5px"}}><Typography sx={{fontSize: { xs: "13px", sm: "16px" }}}>{comments.comment}</Typography></Box>
    </Paper>
  )
}
