import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,updateProfile,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcK8tA5T90ZtR6wiwLpOZEXjCoSlPIfjg",
  authDomain: "vote-it-out-9c491.firebaseapp.com",
  projectId: "vote-it-out-9c491",
  storageBucket: "vote-it-out-9c491.appspot.com",
  messagingSenderId: "543196961909",
  appId: "1:543196961909:web:d3d72976b95d98c12bec3c",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const signInWithGoogle =async () => {
 await signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      // console.log(auth)
    })
    .catch((error) => {
      console.log(error);
    });
};

export const signout = () => {
  signOut(auth)
    .then((result) => {
      console.log("sign out");
    })
    .catch((err) => {
      console.log(err);
    });
};
export const signin = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {
      displayName: name,
    });
    console.log(userCredential);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const login =async(email,password)=>{
  await signInWithEmailAndPassword(auth,email,password)
  .then((result) => {
    // sendEmailVerification(auth.currentUser)
    console.log(result)
  })
  .catch((error) => {throw error});
}