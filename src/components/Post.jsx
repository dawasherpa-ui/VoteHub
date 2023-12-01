import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../tools/Firebase";
import { collection, orderBy } from "firebase/firestore";
import { query, where, getDocs, limit } from "firebase/firestore";
import Postcard from "./Postcard";
import { Box, Skeleton } from "@mui/material";
import { supabase } from "../tools/Supabase";
import { Context } from "../tools/AuthContext";
export default function Post({ path, id }) {
  const [post, setPost] = useState([]);
  const [load, setLoad] = useState(true);
  const [uids, setUids] = useState([]);
  const {update}=useContext(Context)
  useEffect(()=>{
    updateData();
  },[update])
  const handlePostUpdate = () => {
    updateData();
  };
  const updateData = async () => {
    if (path === "profile") {
      const userID = id;
      const postsArray = await getPostsByUserID(userID);
      setPost(postsArray);
    } else if (path === "feed") {
      await fetchLimitedPosts(id);
    } else if (path === "following") {
      await getfollowing();
    }
  };
  const fetchData = async () => {
    setLoad(true)
    if (path === "profile") {
      const userID = id;
      const postsArray = await getPostsByUserID(userID);
      setPost(postsArray);
    } else if (path === "feed") {
      await fetchLimitedPosts(id);
    } else if (path === "following") {
      await getfollowing();
    }
    setLoad(false);
  };

  const fetchLimitedPosts = async (lim) => {
    try {
      // Fetch a limited number of posts from Firestore
      const postsCollection = collection(db, "posts");
      const q = query(postsCollection, limit(lim), orderBy("timestamp", "desc")); // Change 5 to the desired limit
      const querySnapshot = await getDocs(q);

      // Convert the query snapshot to an array
      const limitedPostsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      // Set limited posts to the state
      setPost(limitedPostsArray);
    } catch (error) {
      console.error("Error fetching limited posts:", error);
    }
  };

  const getfollowing = async () => {
    try {
      const { data, error } = await supabase
        .from("profile")
        .select("following")
        .eq("uid", auth.currentUser?.uid);

      if (data) {
        const followingArray = data[0]?.following;
        setUids(followingArray);
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, path]);

  useEffect(() => {
    const fetchDataByUserIDs = async () => {
      if (path === "following" && uids.length > 0) {
        const postsArray = await getPostsByUserIDs();
        setPost(postsArray);
      }
    };

    fetchDataByUserIDs();
  }, [uids, path]);

  async function getPostsByUserIDs() {
    try {
      const postsCollection = collection(db, "posts");
      const q = query(postsCollection, where("userID", "in", uids), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        postsArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      return postsArray;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function getPostsByUserID(userID) {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, where("userID", "==", userID), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const postsArray = [];

    querySnapshot.forEach((doc) => {
      postsArray.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return postsArray;
  }
  return (
    <Box 
      sx={{
        display: "flex",
        width: { xs: "100%", md: "600px", lg: "600px" },
        flexDirection: `${path==="profile"?"column":"column"}`,
        gap: "10px",
        padding: "10px",
      }}
    >
      {!load ? (
        post.map((e) => (
          <div key={e.id}>
            <Postcard data={e.data} docId={e.id} onUpdate={handlePostUpdate} />
          </div>
        ))
      ) : (["1","2","3"].map((e)=>
        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", md: "600px", lg: "600px" },
            flexDirection:"column",
            bgcolor:"background.paper",
            gap: "10px",
            padding: "10px",
          }}
        >
          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Skeleton variant="circular" height={35} width={35} sx={{bgcolor:"gray"}} />
            <Skeleton variant="rectangular" heigth={35} width="100%" sx={{bgcolor:"gray"}} />
          </Box>
          <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} height={100}/>
          <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} height={30}/>
        </Box>)
      )}
    </Box>
  );
}
